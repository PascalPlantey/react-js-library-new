import { isIterable } from '../is';

/**
 * Makes sure an item is iterable
 * @param {any} item Item to make iterable
 * @returns {Iterable} Iterable item (as-is if already iterable or as array)
 * @memberof JS_Misc#
 */
const toIterable = item => isIterable(item) ? item : [item];

export default toIterable;