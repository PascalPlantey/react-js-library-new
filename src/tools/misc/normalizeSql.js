import { isDate } from "../is";
import { frozenObject } from "./emptyObject";

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
      .filter(([, value]) => value !== undefined)
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
export const normalizeForSqlComparison = (editRecord, initialRecord = frozenObject) => {
  const result = {};

  for (const [key, value] of Object.entries(editRecord)) {
    if (!(key in initialRecord) && (value === '' || value === null)) continue;
    result[key] = value === '' ? null : value;
  }

  return result;
};

/**
 * Converts a SQL date string to a JavaScript Date object.
 * @param {string} dateStr - A SQL date string (e.g., "2023-12-25" or "2023-12-25T10:30:00Z")
 * @returns {Date|null} A Date object if dateStr is provided, otherwise null
 */
export const dateFromSql = dateStr => dateStr ? new Date(dateStr) : null;

/**
 * Converts a JavaScript Date object to a SQL date string in the format 'YYYY-MM-DD'.
 *
 * @param {Date} date - The Date object to convert.
 * @returns {string|null} The formatted date string, or null if the input is not a valid Date.
 */
export const dateToSql = date => {
  if (!isDate(date)) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};