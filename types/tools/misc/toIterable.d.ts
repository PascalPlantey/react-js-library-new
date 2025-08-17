export default toIterable;
/**
 * Makes sure an item is iterable
 * @param {any} item Item to make iterable
 * @returns {Iterable} Iterable item (as-is if already iterable or as array)
 *
 * @remarks
 * Be careful: string is iterable so isIterable('abc') === true
 */
declare function toIterable(item: any): Iterable<any>;
