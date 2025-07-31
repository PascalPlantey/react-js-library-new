export default useDebounceResult;
/**
 * Executes a function after a debounced timeout and returns the result.
 * Useful for expensive calculations that depend on frequently changing values.
 * Built on top of useDebounce for consistency.
 *
 * @param {Function} func - Function to execute after debounce
 * @param {any|Function} [dflt] - Default value or function returning default value
 * @param {number} [timeout=500] - Debounce delay in milliseconds
 * @param {Array} deps - Dependencies array that triggers recalculation
 * @returns {useDebounceResultReturn} Tuple [result, isCalculating]
 *
 * @example
 * // Filter large dataset
 * const [filteredData, isFiltering] = useDebounceResult(
 *   () => data.filter(item => item.name.includes(searchTerm)),
 *   [],
 *   300,
 *   [data, searchTerm]
 * );
 *
 * @example
 * // Expensive calculation
 * const [result, isCalculating] = useDebounceResult(
 *   () => performHeavyCalculation(inputValue),
 *   0,
 *   500,
 *   [inputValue]
 * );
 */
declare function useDebounceResult(func: Function, dflt?: any | Function, timeout?: number, deps?: any[]): useDebounceResultReturn;
