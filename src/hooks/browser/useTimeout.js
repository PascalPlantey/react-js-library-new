import { useCallback, useRef } from "react";

import { useLast, useOnDismount, useRunOnce } from "../react";

import { isFunction } from "../../tools";

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
  const timeoutRef = useRef(null);
  const fn = useLast(actionFn);

  const clearTimeoutHandler = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimeout = useCallback(during => {
    const action = fn.current;
    clearTimeoutHandler();

    timeoutRef.current = setTimeout(() => {
      if (isFunction(action)) action();
      else                    console.warn("useTimeout: actionFn is not a function", typeof action);
    }, during || delay);

  }, [fn, clearTimeoutHandler, delay]);

  useRunOnce(() => {
    now && startTimeout();
  });
  useOnDismount(clearTimeoutHandler);

  return { startTimeout, clearTimeout: clearTimeoutHandler };
};

export default useTimeout;