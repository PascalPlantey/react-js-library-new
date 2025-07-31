/**
 * Indicates if the object obj has a property named 'name'
 * @param {object} obj Object to be tested
 * @param {PropertyKey} name Name of the property to check
 * @returns {boolean}
 * @memberof JS_IsFunctions#
 */
const isProperty = (obj, name) => Object.hasOwn(obj, name);

export default isProperty;