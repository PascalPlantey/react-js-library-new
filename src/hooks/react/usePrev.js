import { useRef } from "react";

/**
 * Custom React hook that returns the previous value of a given variable.
 *
 * @param {*} value - The current value to track.
 * @returns {*} The previous value before the current render, or undefined on the first render.
 */
const usePrev = value => {
  const prevRef = useRef();
  const prevValue = prevRef.current;
  prevRef.current = value;              // Update the ref with the current value for next time

  // Return the previous value
  return prevValue;
};

export default usePrev;