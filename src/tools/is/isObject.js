/**
 * Checks if the provided value is a plain object (not null and not an array).
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns true if the value is a plain object, otherwise false.
 */
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export default isObject;