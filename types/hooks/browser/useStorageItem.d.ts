export default useStorageItem;
/**
 * Custom React hook for managing a value in localStorage or sessionStorage with state synchronization.
 *
 * @param {string} key - The storage key to use.
 * @param {*} [def=''] - The default value to use if the key does not exist in storage.
 * @param {boolean} [local=true] - If true, uses localStorage; if false, uses sessionStorage.
 * @returns {[any, function, function]}
 *   An array containing:
 *     - The current value from storage.
 *     - A setter function to update the value.
 *     - A function to remove the key from storage and reset the state.
 */
declare function useStorageItem(key: string, def?: any, local?: boolean): [any, Function, Function];
