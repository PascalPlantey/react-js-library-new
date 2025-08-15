import { useState, useCallback } from "react";


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
