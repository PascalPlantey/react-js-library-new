export default useSharedStorage;
/**
 * Custom React hook for shared storage with optional encryption.
 *
 * This hook reads and writes data to a file in the device's Documents directory,
 * optionally encrypting and decrypting the data using a provided encryption key.
 * It automatically initializes the file with a default value if it does not exist.
 *
 * @param {string} fileName - The name of the file to use for storage.
 * @param {*} defaultValue - The default value to use if the file does not exist or decryption fails.
 * @param {string} [encryptionKey] - Optional encryption key for encrypting/decrypting the stored data.
 * @returns {[any, function(any): Promise<void>, boolean]}
 *   Returns a tuple containing:
 *     - The current value from storage.
 *     - An async function to update the value in storage.
 *     - A boolean indicating if the value is still loading.
 *
 * @example
 * const [data, setData, loading] = useSharedStorage('settings.json', { theme: 'dark' }, 'my-secret-key');
 *
 * @remarks
 * This hook requires Capacitor's Filesystem API to read and write files (`@capacitor/filesystem`)
 *
 * @maintenance
 * 03/09/2025: switched from Directory.Documents to Directory.Data to avoid permission issues
 */
declare function useSharedStorage(fileName: string, defaultValue: any, encryptionKey?: string): [any, (arg0: any) => Promise<void>, boolean];
