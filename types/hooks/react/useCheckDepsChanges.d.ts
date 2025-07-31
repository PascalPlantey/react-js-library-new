export default useCheckDepsChanges;
/**
 * Hook that provides a way to check if dependencies have changed, useful for development time
 *
 * @param {...any} deps - Dependencies to check for changes
 * @returns {[boolean : changed, [{index: number, previous: any, current: any}]]}
 * - Returns an array where the first element is a boolean indicating if any dependencies changed,
 *   and the second element is an array of objects describing the changes.
 *
 * @example
 * // Basic usage
 * useEffect(() => {}, [val1, val2]);
 * const [changed, changes] = useCheckDepsChanges(val1, val2);
 */
declare function useCheckDepsChanges(...deps: any[]): [boolean: changed, [{
    index: number;
    previous: any;
    current: any;
}]];
