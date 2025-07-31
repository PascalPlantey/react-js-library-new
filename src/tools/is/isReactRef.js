/**
 * Indicates if a variable is a react Ref (createRef, useRef, ...)
 * @param {any} variable Variable to be tested
 * @returns {boolean}
 * @memberof JS_IsFunctions#
 */
const isReactRef = variable => typeof variable === 'object' && variable !== null && 'current' in variable;

export default isReactRef;