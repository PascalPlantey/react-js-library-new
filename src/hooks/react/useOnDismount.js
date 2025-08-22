import { useEffect, useRef } from 'react';

import useLast from './useLast';

import isFunction from '../../tools/is/isFunction';

/**
 * Custom React hook that invokes a callback function when the component is unmounted.
 *
 * @param {Function} fn - The function to be called on component unmount
 * @returns {*} - The return value of the callback function (stable, will not change)
 */
const useOnDismount = fn => {
  const fnRef = useLast(fn);  // Stable ref that always points to latest fn
  const resultRef = useRef();

  useEffect(() => {
    const fn = fnRef.current;
    if (!isFunction(fn))
      console.warn("useOnDismount: Provided callback is not a function:", typeof fn);
    else
      return () => {
        try {
          resultRef.current = fn();
        } catch (error) {
          console.error("useOnDismount: exception while running provided function", error);
        }
      };
  }, [fnRef]);                // Effect runs once, fnRef is stable and does not change

  return resultRef.current;
};

export default useOnDismount;