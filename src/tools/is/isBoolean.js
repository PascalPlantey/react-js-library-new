/**
 * Checks if a value is a boolean. Helps distinguish with undefined or null
 * @param {any} val Value to be checked
 * @returns {boolean} True if boolean
 * @memberof JS_IsFunctions#
 */
const isBoolean = val => val === false || val === true;

export default isBoolean;