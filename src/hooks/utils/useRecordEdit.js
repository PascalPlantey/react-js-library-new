import { useCallback } from "react";

import { normalizeForSqlComparison } from "./../../tools/misc/normalizeSql.js";
import { frozenObject } from "../../tools/misc/emptyObject.js";
import useEditableState from "./useEditableState.js";

/**
 * Custom React hook for managing the editing state of a record.
 *
 * @param {Object} initialRecord - The initial record object to be edited.
 * @returns {{
 *   initialRecord: Object,
 *   editRecord: Object,
 *   handleChange: (name: string, value: any) => void,
 *   setEditRecord: React.Dispatch<React.SetStateAction<Object>>,
 *   hasChanged: boolean,     // Indicates if the record has unsaved changes
 *   hasBeenSaved: boolean,   // Indicates if the record has been saved
 *   setHasBeenSaved: React.Dispatch<React.SetStateAction<boolean>>
 * }} An object containing the initial record, the current edited record,
 * a function to handle changes to record fields, setter for the edited record, and a boolean
 * indicating if changes have been made from initialRecord.
 * 
 * @description
 * This hook manages the state of a record being edited. It provides functionality to track changes,
 * handle field updates, and determine if the record has unsaved changes compared to the initial state.
 * Warning: after saving, the hasChanged flag will remain false until the initialRecord prop changes.
 */
const useRecordEdit = (initialRecord = frozenObject) => {
  const {
    initialValue,
    value: editRecord,
    setValue: setEditRecord,
    hasChanged,
    setHasBeenSaved,
  } = useEditableState(initialRecord, {
    isEqual: (baseRecord, currentRecord) => {
      const normalizedRecord = normalizeForSqlComparison(currentRecord || {}, baseRecord || {});
      return JSON.stringify(baseRecord) === JSON.stringify(normalizedRecord);
    },
  });

  const handleChange = useCallback((name, value) => {
    setHasBeenSaved(false);
    setEditRecord(prev => (
      prev[name] === value
        ? prev
        : { ...prev, [name]: value }
    ))
  }, [setEditRecord, setHasBeenSaved]);

  // console.log("useRecordEdit: hasChanged =", { hasChanged, initialRecord, editRecord, normalizedRecord });
  return ({
    initialRecord: initialValue,
    editRecord,
    onChange: handleChange,
    setEditRecord,
    hasChanged,
    setHasBeenSaved,
  });
};

export default useRecordEdit;