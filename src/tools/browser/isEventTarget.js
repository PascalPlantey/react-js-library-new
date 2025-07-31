/**
 * Check if document element supports event
 * @param {any} elt Element to be checked
 * @returns {boolean}
 * @memberof JS_BrowserHelpers#
 * @maintenance
 *  . 11/01/2024: always return Boolean true/false
 */
const isEventTarget = elt => !!elt?.addEventListener;

export default isEventTarget;