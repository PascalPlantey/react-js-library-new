/**
 * Normalizes an object for SQL insertion/update by:
 * - Removing properties with `undefined` values.
 * - Converting empty string values (`''`) to `null`.
 *
 * @param {Object} record - The input object to normalize.
 * @returns {Object} A new object with `undefined` values removed and empty strings replaced by `null`.
 */
export const normalizeToSql = record =>
  Object.fromEntries(
    Object.entries(record)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, value === '' ? null : value])
  );

/**
 * Normalizes two objects for SQL comparison by:
 * - Converting empty string values to null.
 * - Removing keys from editRecord whose value is '' or null AND are also ''/null/undefined in initialRecord.
 *
 * @param {Object} editRecord - The edited record object.
 * @param {Object} initialRecord - The initial record object.
 * @returns {Object} A new object ready for comparison.
 */
export const normalizeForSqlComparison = (editRecord, initialRecord = {}) => {
  const result = {};
  for (const [key, value] of Object.entries(editRecord)) {
    if (!(key in initialRecord)) continue;
    result[key] = value === '' ? null : value;
  }
  return result;
};