import { useState, useEffect } from "react";

import useDebounce from "./useDebounce";

import resolve from "../../tools/misc/resolve";
import { frozenArray } from "../../tools/misc/emptyObject.js";

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
const useDebounceResult = (func, dflt, timeout = 500, deps = frozenArray) => {
  const [result, setResult] = useState(() => resolve(dflt));
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Use our existing useDebounce hook for consistency
  const debouncedCalculate = useDebounce(() => {
    try {
      const newResult = func();
      setResult(newResult);
    } catch (error) {
      console.error('useDebounceResult calculation error:', error);
      setResult(resolve(dflt));
    } finally {
      setIsCalculating(false);
    }
  }, timeout);

  useEffect(() => {
    setIsCalculating(true);
    setResult(resolve(dflt)); // Reset to default while calculating
    debouncedCalculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCalculate, dflt, ...deps]);

  return [result, isCalculating];
};

export default useDebounceResult;