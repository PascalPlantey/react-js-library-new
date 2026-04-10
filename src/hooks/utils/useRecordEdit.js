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
 *   resetAfterSave: Function,
 * }} An object containing the initial record, the current edited record,
 * a function to handle changes to record fields, setter for the edited record, and a boolean
 * indicating if changes have been made from initialRecord.
 */
const useRecordEdit = (initialRecord = frozenObject) => {
  const {
    initialValue,
    value: editRecord,
    setValue: setEditRecord,
    hasChanged,
    resetAfterSave,
  } = useEditableState(initialRecord, {
    isEqual: (baseRecord, currentRecord) => {
      const normalizedRecord = normalizeForSqlComparison(currentRecord || {}, baseRecord || {});
      return JSON.stringify(baseRecord) === JSON.stringify(normalizedRecord);
    },
  });

  const handleChange = useCallback((name, value) => {
    setEditRecord(prev => (
      prev[name] === value
        ? prev
        : { ...prev, [name]: value }
    ))
  }, [setEditRecord]);

  // console.log("useRecordEdit: hasChanged =", { hasChanged, initialRecord, editRecord, normalizedRecord });
  return ({
    initialRecord: initialValue,
    editRecord,
    onChange: handleChange,
    setEditRecord,
    hasChanged,
    resetAfterSave,
  });
};

export default useRecordEdit;