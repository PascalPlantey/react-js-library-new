export default useTimer;
/**
 * Sends a render every intervalMs ms until `secondsUntilStop` comes to zero
 * @param {number} secondsUntilStop Number of seconds to wait before stopping
 * @param {boolean} [immediately=true] If true, starts immediately
 * @param {number} [intervalMs=1000] Interval in ms between each decrement
 * @returns {Object} Timer state and actions
 * @example
 * const { working, remainingTime, toggle, reset } = useTimer(10, true, 500); // décrémente toutes les 500ms
 */
declare function useTimer(secondsUntilStop: number, intervalMs?: number, immediately?: boolean): any;
