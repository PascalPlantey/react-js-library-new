/**
 * Indicates if value is a number
 * @param {any} value Value to be tested
 * @returns {boolean}
 * @memberof JS_IsFunctions#
 */
const isNumber = value => typeof value === 'number' && isFinite(value);

export default isNumber;
