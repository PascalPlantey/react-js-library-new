import { useRef } from "react";
import useIsFirstRender from "./useIsFirstRender";

/**
 * Custom React hook that returns the previous value of a given variable.
 *
 * @param {*} value - The current value to track.
 * @returns {[any, boolean]} A tuple of [previousValue, isFirstRender].
 */
const usePrev = value => {
  const isFirstRender = useIsFirstRender();
  const prevRef = useRef();
  const prevValue = prevRef.current;
  prevRef.current = value;              // Update the ref with the current value for next time

  // Return previous value plus first-render flag
  return [prevValue, isFirstRender];
};

export default usePrev;