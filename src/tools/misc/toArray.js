/**
 * Converts a value to an array if it isn't already one.
 * 
 * @param {*} item - The value to convert to an array
 * @returns {Array} The original array if item was already an array, otherwise a new array containing the item
 * 
 * @example
 * toArray([1, 2, 3]); // Returns [1, 2, 3]
 * toArray('hello');   // Returns ['hello']
 * toArray(42);        // Returns [42]
 */
const toArray = item => (Array.isArray(item) ? item : [item]);

export default toArray;