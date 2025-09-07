import { useCallback } from "react";

import useLast from "./useLast";

import isFunction from "../../tools/is/isFunction";

/**
 * Returns a stable callback function that always invokes the latest version of the provided function.
 *
 * @param {Function} fn - The function to be stabilized.
 * @returns {Function} A memoized callback that calls the latest version of `fn`.
 *
 * @throws {void} Logs an error if the provided argument is not a function.
 *
 * @example
 * const stableCallback = useStableFunction((value) => console.log(value));
 */
const useStableFunction = fn => {
  const fnRef = useLast(fn);

  if (!isFunction(fn))
    console.error('useStableFunction: The provided argument is not a function.');

  return useCallback((...args) => fnRef.current(...args), []);
};

export default useStableFunction;