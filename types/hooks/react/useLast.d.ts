export default useLast;
/**
 * useLast hook - Always returns a ref to the latest value
 * Useful for accessing the most recent version of a value in closures
 * @param {any} value Current value to track
 * @returns {object} Ref object with .current pointing to latest value
 * @example
 * const fnRef = useLast(fn);
 * useEffect(() => () => fnRef.current(), []); // Always latest fn
 */
declare function useLast(value: any): object;
