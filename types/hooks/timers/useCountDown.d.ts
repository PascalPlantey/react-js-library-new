export default useCountDown;
/**
 * Execute a function after initialSeconds has elapsed
 * @param {function} action Function to execute when time has elapsed : () => void
 * @param {number} runAfterSeconds Number of seconds before callback is executed
 * @param {boolean} immediately Start countdown immediately or after toggle()/reset() is called
 * @returns {useTimerResult} { remainingTime, working, toggle, reset }
 */
declare function useCountDown(action: Function, runAfterSeconds: number, immediately?: boolean): useTimerResult;
