/**
 * Checks if the provided value is a valid Date object or a valid date string.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns true if the value is a valid Date object
 */
const isDate = value => value instanceof Date && !isNaN(value);

export default isDate;