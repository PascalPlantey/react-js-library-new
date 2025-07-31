import { useState, useCallback } from "react";

/**
 * @typedef {Object} UseCounterActions
 * @property {(value: number | ((prev: number) => number)) => void} setValue - Set counter value directly
 * @property {(step?: number) => void} increment - Increment counter by step (default 1)
 * @property {(step?: number) => void} decrement - Decrement counter by step (default 1)
 * @property {() => void} reset - Reset counter to initial value
 * @property {(value: number) => void} set - Alias for setValue
 */

/**
 * @typedef {[number, UseCounterActions]} UseCounterReturn
 */
/**
 * Hook for managing counter state with increment/decrement utilities
 * @param {number} [initial=0] Initial counter value
 * @returns {Array} [value, { setValue, increment, decrement, reset }]
 */
const useCounter = (initial = 0) => {
  const [value, setValue] = useState(initial);

  const increment = useCallback((step = 1) => setValue(prev => prev + step), []);
  const decrement = useCallback((step = 1) => setValue(prev => prev - step), []);
  const reset = useCallback(() => setValue(initial), [initial]);

  return [
    value,
    {
      setValue,
      increment,
      decrement,
      reset
    }
  ];
};

export default useCounter;
