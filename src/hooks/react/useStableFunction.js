import { useCallback } from "react";

import useLast from "./useLast";

import isFunction from "../../tools/is/isFunction";

/**
 * Returns a stable callback function that always invokes the latest version of the provided function.
 *
 * @param {Function} fn - The function to be stabilized.
 * @returns {Function} A memoized stable callback that calls the latest version of `fn`
 *
 * @console {void} Logs an error if the provided argument is not a function.
 *
 * @example
 * const stableCallback = useStableFunction((value) => console.log(value));
 */
const useStableFunction = fn => {
  console.assert(isFunction(fn), 'useStableFunction: The provided argument is not a function.');

  const fnRef = useLast(fn);

  return useCallback((...args) => fnRef.current(...args), [fnRef]);
};

export default useStableFunction;