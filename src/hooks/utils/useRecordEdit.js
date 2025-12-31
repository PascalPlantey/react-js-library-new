import { useCallback, useEffect, useState } from "react";

import { normalizeForSqlComparison } from "./../../tools/misc/normalizeSql.js";

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
const useRecordEdit = (initialRecord = {}) => {
  const [editRecord, setEditRecord] = useState(() => structuredClone(initialRecord));
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  useEffect(() => {
    setEditRecord(structuredClone(initialRecord));
    setHasBeenSaved(false);
  }, [initialRecord]);

  const handleChange = useCallback((name, value) =>
    setEditRecord(prev => (
      prev[name] === value
        ? prev
        : { ...prev, [name]: value }
    ))
  , []);

  const onHasBeenSaved = useCallback(() =>setHasBeenSaved(true), []);

  // SQL normalization: convert empty strings to null for comparison: empty object if no record
  const normalizedRecord = normalizeForSqlComparison(editRecord || {}, initialRecord);

  const hasChanged = hasBeenSaved
    ? false
    : JSON.stringify(initialRecord) !== JSON.stringify(normalizedRecord);

  return ({
    initialRecord,
    editRecord,
    handleChange,
    setEditRecord,
    hasChanged,
    hasBeenSaved,
    setHasBeenSaved: onHasBeenSaved,
  });
};

export default useRecordEdit;