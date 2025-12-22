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
 * Normalizes an object's values for SQL comparison by converting empty string values to null.
 *
 * @param {Object} record - The input object whose values will be normalized.
 * @returns {Object} A new object with empty string values replaced by null, all other values unchanged.
 */
export const normalizeForSqlComparison = record =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, value === '' ? null : value])
  );