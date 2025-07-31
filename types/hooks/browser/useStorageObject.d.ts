export default useStorageObject;
export type UseStorageObjectReturn<T> = [T, (value: T | ((prev: T) => T)) => void];
/**
 * @template T
 * @typedef {[T, (value: T | ((prev: T) => T)) => void]} UseStorageObjectReturn
 */
/**
 * Custom React hook for managing an object in localStorage or sessionStorage.
 *
 * @param {string} key - The storage key to use.
 * @param {Object} [defaultObj={}] - The default object value if none exists in storage.
 * @param {boolean} [local=true] - If true, uses localStorage; otherwise, uses sessionStorage.
 * @returns {[Object, Function, Function, Function]}
 *   An array containing:
 *     - The current object from storage.
 *     - A setter function to update the entire object.
 *     - A function to update a specific property of the object.
 *     - A function to remove the object from storage.
 */
declare function useStorageObject(key: string, defaultObj?: any, local?: boolean): [any, Function, Function, Function];
