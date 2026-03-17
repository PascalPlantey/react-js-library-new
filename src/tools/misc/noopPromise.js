/**
 * Stable no-op promise that resolves to an empty array. Useful as a default value for promise-returning functions to avoid having
 * to check if the function is defined before calling it.
 * @returns {Promise}
 */
const noopPromise = () => Promise.resolve([]);

export default noopPromise;