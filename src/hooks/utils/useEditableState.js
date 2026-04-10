import { useCallback, useEffect, useState } from "react";

import { frozenObject } from "../../tools/misc/emptyObject.js";

import useLast from "../react/useLast.js";

const defaultClone = value => structuredClone(value);
const defaultIsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const normalizeOptions = optionsOrClone => {
  if (typeof optionsOrClone === 'function')
    return { clone: optionsOrClone };

  return optionsOrClone || frozenObject;
};

/**
 * Generic hook to manage an editable value with reset-on-input-change and save baseline.
 *
 * @param {any} [initialValue=frozenObject] - Base value used to initialize and reset editable state.
 * @param {(value: any) => any|{ clone?: (value: any) => any, isEqual?: (a: any, b: any) => boolean }} [optionsOrClone=structuredClone]
 * Clone function or options used to isolate internal state and compute the modified flag.
 * @returns {{
 *   initialValue: any,
 *   value: any,
 *   setValue: Function,
 *   hasChanged: boolean,
 *   resetAfterSave: Function,
 * }}
 */
const useEditableState = (initialValue = frozenObject, optionsOrClone = defaultClone) => {
  const { clone = defaultClone, isEqual = defaultIsEqual } = normalizeOptions(optionsOrClone);
  const cloneRef = useLast(clone);

  const cloneValue = useCallback(value => cloneRef.current(value), [cloneRef]);
  const [committedValue, setCommittedValue] = useState(() => cloneValue(initialValue));
  const [editableValue, setEditableValue] = useState(() => cloneValue(initialValue));

  useEffect(() => {
    setCommittedValue(cloneValue(initialValue));
    setEditableValue(cloneValue(initialValue));
  }, [initialValue, cloneValue]);

  const resetAfterSave = useCallback(() => {
    setCommittedValue(cloneValue(editableValue));
  }, [cloneValue, editableValue]);

  const hasChanged = !isEqual(committedValue, editableValue);

  return {
    initialValue: committedValue,
    value: editableValue,
    setValue: setEditableValue,
    hasChanged,
    resetAfterSave,
  };
};

export default useEditableState;