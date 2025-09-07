import { useRef } from 'react';

import isEqual from 'lodash.isequal';

/**
 * Custom React hook that returns a stable reference to a value, updating the reference only 
 * if the new value is not deeply equal to the previous one. Useful for optimizing performance by preventing
 * unnecessary re-renders or effects when the value hasn't changed meaningfully.
 *
 * @param {*} value - The value to be compared and potentially stored in the ref.
 * @returns {*} - The same reference if the value is deeply equal, otherwise the new value.
 * 
 * @description
 * Useful for non primitive values (objects, arrays, functions) to avoid unnecessary re-renders or effect executions.
 * 
 * @example
 * const stableValue = useSameRefIfIsEqual({ a: 1, b: 2 }); // stableValue will never change
 */
const useSameRefIfIsEqual = (value) => {
  const ref = useRef(value);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
    return value;
  }
  else
    return ref.current;
};

export default useSameRefIfIsEqual;