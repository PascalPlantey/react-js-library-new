import { useEffect } from "react";

import useLast from "./useLast";

import { isFunction } from '../../tools/is';

/**
 * Custom React hook that runs the provided function only once after the component mounts.
 *
 * @param {Function} fn - The function to execute once on mount.
 * @returns {void}
 *
 * @remarks
 * Should be changed or deleted as it is the same as useOnMount
 */
const useRunOnce = (fn) => {
  const fnRef = useLast(fn);

  useEffect(() => {
    if (!isFunction(fnRef.current))
      console.warn('useRunOnce: Expected a function, received:', typeof fnRef.current);
    else
      fnRef.current();
  }, [fnRef]);
};

export default useRunOnce;