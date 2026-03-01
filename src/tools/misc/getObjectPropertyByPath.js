/**
 * Retrieves the value of a nested property within an object using a dot-separated path string.
 *
 * @param {Object} obj - The object to query.
 * @param {string} path - The dot-separated path string (e.g., "a.b.c").
 * @returns {*} The value at the specified path, or undefined if the path does not exist.
 * 
 * @example
 * const data = { user: { name: { first: "John", last: "Doe" } } };
 * getObjectPropertyByPath(data, "user.name.first"); // returns "John"
 * getObjectPropertyByPath(data, "user.age"); // returns undefined
 */
const getObjectPropertyByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

export default getObjectPropertyByPath;