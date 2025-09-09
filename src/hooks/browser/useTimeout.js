import { useCallback, useEffect, useRef } from "react";

import useLast from "../react/useLast";

import isFunction from "../../tools/is/isFunction";

/**
 * Custom React hook to handle timeouts with automatic cleanup.
 *
 * @param {Function} actionFn - The function to execute after the timeout.
 * @param {number} [delay=3000] - The delay in milliseconds before executing the action.
 * @param {boolean} [now=false] - Whether to start the timeout immediately on mount.
 * @returns {{ startTimeout: (during?: number) => void, clearTimeout: () => void }} 
 *   An object containing:
 *     - startTimeout: Function to start the timeout. Optionally accepts a custom delay.
 *     - clearTimeout: Function to clear the current timeout.
 *
 * @example
 * const { startTimeout, clearTimeout } = useTimeout(() => console.log('Timeout!'), 2000);
 * startTimeout(); // Starts a 2-second timeout
 * startTimeout(5000); // Starts a 5-second timeout
 * 
 * // Auto-start on mount
 * const timer = useTimeout(() => console.log('Auto!'), 1000, true);
 */
const useTimeout = (actionFn, delay = 3000, now = false) => {
  console.assert(isFunction(actionFn), 'useTimeout: The provided actionFn is not a function.');
  const timeoutRef = useRef(null);
  const fnRef = useLast(actionFn);

  const clearTimeoutHandler = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimeout = useCallback(during => {
    clearTimeoutHandler();                                      // Clear any existing timeout

    const action = fnRef.current;
    timeoutRef.current = setTimeout(action, during ?? delay);   // Execute action after specified delay

  }, [fnRef, clearTimeoutHandler, delay]);

  // Auto-start if requested and cleanup on unmount
  useEffect(() => {
    if (now) startTimeout();
    return clearTimeoutHandler;                                 // Cleanup on unmount
  }, [now, startTimeout, clearTimeoutHandler]);

  return { startTimeout, clearTimeout: clearTimeoutHandler };
};

export default useTimeout;