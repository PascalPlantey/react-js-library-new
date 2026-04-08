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
 * Generic hook to manage an editable value with reset-on-input-change and save marker.
 *
 * @param {any} [initialValue=frozenObject] - Base value used to initialize and reset editable state.
 * @param {(value: any) => any|{ clone?: (value: any) => any, isEqual?: (a: any, b: any) => boolean }} [optionsOrClone=structuredClone]
 * Clone function or options used to isolate internal state and compute the modified flag.
 * @returns {{
 *   initialValue: any,
 *   value: any,
 *   setValue: Function,
 *   hasChanged: boolean,
 *   setHasBeenSaved: Function,
 * }}
 */
const useEditableState = (initialValue = frozenObject, optionsOrClone = defaultClone) => {
  const { clone = defaultClone, isEqual = defaultIsEqual } = normalizeOptions(optionsOrClone);
  const cloneRef = useLast(clone);

  const cloneValue = useCallback(value => cloneRef.current(value), [cloneRef]);
  const [editableValue, setEditableValue] = useState(() => cloneValue(initialValue));
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  useEffect(() => {
    setEditableValue(cloneValue(initialValue));
    setHasBeenSaved(false);
  }, [initialValue, cloneValue]);

  const hasChanged = hasBeenSaved ? false : !isEqual(initialValue, editableValue);

  return {
    initialValue,
    value: editableValue,
    setValue: setEditableValue,
    hasChanged,
    setHasBeenSaved,
  };
};

export default useEditableState;