import isString from "../is/isString";

/**
 * Converts the first character of a string to uppercase.
 * 
 * @param {*} str - The string to convert.
 * @returns {string|*} Returns the converted string if input is a string, otherwise returns the input unchanged.
 * 
 * @example
 * upperFirst('hello')
 * // => 'Hello'
 * 
 * @example
 * upperFirst('WORLD')
 * // => 'WORLD'
 * 
 * @example
 * upperFirst(123)
 * // => 123
 */
const upperFirst = str => 
  isString(str)
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;

export default upperFirst;