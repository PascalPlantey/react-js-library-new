import isFunction from './isFunction';

/**
 * Indicates if value is iterable
 * @param {any} value value to be checked
 * @returns {boolean}
 */
export const isIterable = value => isFunction(value?.[Symbol.iterator]);

export default isIterable;
