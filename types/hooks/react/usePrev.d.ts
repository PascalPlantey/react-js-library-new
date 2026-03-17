export default usePrev;
/**
 * Custom React hook that returns the previous value of a given variable.
 *
 * @param {*} value - The current value to track.
 * @returns {[any, boolean]} A tuple of [previousValue, isFirstRender].
 */
declare function usePrev(value: any): [any, boolean];
