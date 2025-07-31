import isString from './isString';

/**
 * Indicates if value is numeric (contains only numeric characters)
 * @param {string} str Value to be tested
 * @returns {boolean}
 * @memberof JS_IsFunctions#
 */
const isNumeric = str => isString(str) && /^\d+$/.test(str);

export default isNumeric;
