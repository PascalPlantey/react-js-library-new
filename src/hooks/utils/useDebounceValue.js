import { useState, useEffect } from 'react';

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
const useDebounceValue = (value, timeout = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), timeout); // Fix: pas de timeout dans setDebouncedValue
    return () => clearTimeout(handler);
  }, [value, timeout]);

  return debouncedValue;
};

export default useDebounceValue;
