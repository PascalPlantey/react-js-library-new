import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeForSqlComparison } from "react-js-library-new/tools";

/**
 * Custom React hook for managing the editing state of a record.
 *
 * @param {Object} initialRecord - The initial record object to be edited.
 * @returns {{
 *   initialRecord: Object,
 *   editRecord: Object,
 *   handleChange: (name: string, value: any) => void,
 *   setEditRecord: React.Dispatch<React.SetStateAction<Object>>,
 *   hasChanged: boolean
 * }} An object containing the initial record, the current edited record,
 * a function to handle changes to record fields, setter for the edited record, and a boolean
 * indicating if changes have been made from initialRecord.
 */
const useRecordEdit = initialRecord => {
  const [editRecord, setEditRecord] = useState(initialRecord);

  useEffect(() => { setEditRecord(initialRecord); }, [initialRecord]);

  const handleChange = useCallback((name, value) =>
    setEditRecord(prev => (
      prev[name] === value
        ? prev
        : { ...prev, [name]: value }
    )), []);

  // SQL normalization: convert empty strings to null for comparison
  const normalizedRecord = normalizeForSqlComparison(editRecord);
  const hasChanged = JSON.stringify(initialRecord) !== JSON.stringify(normalizedRecord);

  return ({
    initialRecord,
    editRecord,
    handleChange,
    setEditRecord,
    hasChanged
  });
};

export default useRecordEdit;