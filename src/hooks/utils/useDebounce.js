import { useRef, useCallback } from 'react';

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
const useDebounce = (func, timeout = 500) => {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => func(...args), timeout);
  }, [func, timeout]);
};

export default useDebounce;
