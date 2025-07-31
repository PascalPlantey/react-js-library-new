export default useTimeout;
export type UseEventListenerTarget<T> = T | Window | Document | null;
/**
 * @template T
 * @typedef {T | Window | Document | null} UseEventListenerTarget
 */
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
declare function useTimeout(actionFn: Function, delay?: number, now?: boolean): {
    startTimeout: (during?: number) => void;
    clearTimeout: () => void;
};
