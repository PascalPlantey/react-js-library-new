import { useRef } from "react";

/**
 * useLast hook - Always returns a ref to the latest value
 * Useful for accessing the most recent version of a value in closures
 * @param {any} value Current value to track
 * @returns {object} Ref object with .current pointing to latest value
 * @example
 * const fnRef = useLast(fn);
 * useEffect(() => () => fnRef.current(), []); // Always latest fn
 */
const useLast = value => {
  const valueRef = useRef(value);
  valueRef.current = value; // Update the ref with the latest value

  return valueRef;
};

export default useLast;
