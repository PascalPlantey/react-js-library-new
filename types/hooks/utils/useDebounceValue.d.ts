export default useDebounceValue;
/**
 * Debounces a value and returns the debounced version.
 * The value is updated only after the specified timeout with no new changes.
 *
 * @param {any} value - Value to debounce
 * @param {number} [timeout=500] - Delay in milliseconds
 * @returns {any} Debounced value
 *
 * @example
 * // Debounce search input
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounceValue(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * @example
 * // Debounce form input
 * const [email, setEmail] = useState('');
 * const debouncedEmail = useDebounceValue(email, 500);
 *
 * useEffect(() => {
 *   validateEmail(debouncedEmail);
 * }, [debouncedEmail]);
 */
declare function useDebounceValue(value: any, timeout?: number): any;
