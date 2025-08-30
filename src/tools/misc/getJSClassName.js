/**
 * Returns the JS class name associated with the value
 * @param val Value to check explored
 * @returns {string} JS class name
 * @memberof JS_BrowserHelpers#
 * @example
 * getJSClassname('str');                 // => String
 * getJSClassname(12);                    // => Number
 * getJSClassname(document);              // => HTMLDocument
 * getJSClassname(undefined);             // => Undefined
 * getJSClassname(null);                  // => Null
 * getJSClassname(new ExtMap());          // => ExtMap
 */
const getJSClassname = val => Object.prototype.toString.call(val).match(/^\[object\s(.*)\]$/)[1];

export default getJSClassname;