export default useDebounce;
/**
 * React hook that creates a debounced version of a function
 *
 * @param {Function} func - Function to debounce
 * @param {number} [timeout=500] - Delay in milliseconds
 * @returns {Function} Debounced function that updates when func or timeout change
 *
 * @example
 * // Basic usage
 * const debouncedSave = useDebounce(() => {
 *   saveData();
 * }, 1000);
 *
 * @example
 * // Search with debounce
 * const debouncedSearch = useDebounce((query) => {
 *   fetchResults(query);
 * }, 300);
 *
 * @example
 * // Form validation
 * const debouncedValidate = useDebounce(validateForm, 500);
 */
declare function useDebounce(func: Function, timeout?: number): Function;
