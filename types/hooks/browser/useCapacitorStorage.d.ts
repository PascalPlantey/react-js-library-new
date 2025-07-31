export default useCapacitorStorage;
/**
 * Custom React hook for persisting state using Capacitor Preferences storage.
 *
 * @param {string} key - The key under which the value is stored in Capacitor Preferences.
 * @param {*} defaultValue - The default value to use if nothing is stored.
 * @returns {Array} - Returns [value, updateValue] where value is the current stored value and updateValue is an async function to update it.
 */
declare function useCapacitorStorage(key: string, defaultValue: any): any[];
