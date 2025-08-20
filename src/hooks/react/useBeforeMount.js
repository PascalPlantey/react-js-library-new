import { useLayoutEffect, useRef } from "react";

import useLast from "./useLast";

import isFunction from "../../tools/is/isFunction";

/**
 * Custom React hook that executes a callback function synchronously before the component mounts
 *
 * @param {Function} callback - The function to be executed before the component mounts
 * @return {any} The result of the callback function (will be stable for all renders)
 *
 * @example
 * const result = useBeforeMount(() => {
 *   // Code to run before mount
 * });
 */
const useBeforeMount = callback => {
  const fnRef = useLast(callback);
  const resultRef = useRef();
  console.assert(isFunction(callback), "useBeforeMount: callback must be a function");

  useLayoutEffect(() => {
    resultRef.current = fnRef.current();
  }, [fnRef]);

  return resultRef.current;
};

export default useBeforeMount;
