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
 * Parse a SQL date string as a local calendar date (not UTC). If the input is already a Date object
 * 
 * @param {string} date 
 * @returns {Date} A JavaScript Date object representing the given SQL date string, parsed as a local calendar date (not UTC).
 * If the input is already a Date object, it returns a new Date with the same year, month, and day (time set to 00:00:00).
 * If the input is a string in the format 'YYYY-MM-DD', it parses it as a local date.
 * For any other input, it attempts to create a Date object directly from it.
 * This function is useful for normalizing date inputs that may come from SQL or other sources, ensuring that they are treated as local calendar dates.
 * Note: The time component of the returned Date object is set to 00:00:00 local time.
 */
export const parseSqlDateAsLocalDate = date => {
  if (date instanceof Date)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // SQL DATE is provided as YYYY-MM-DD; parse as local calendar date (not UTC)
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(date);
};

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
