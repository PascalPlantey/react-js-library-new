import { useEffect } from 'react';

import useLast from './useLast';

import isFunction from '../../tools/is/isFunction';

/**
 * Custom React hook that invokes a callback function when the component is unmounted.
 *
 * @param {Function} fn - The function to be called on component unmount.
 */
const useOnDismount = fn => {
  const fnRef = useLast(fn);  // Stable ref that always points to latest fn

  useEffect(() => {
    const fn = fnRef.current;
    if (!isFunction(fn))
      console.error("useOnDismount: Provided callback is not a function:", typeof fn);
    else
      return () => {
        try {
          fn();
        } catch (error) {
          console.error("useOnDismount: exception while running provided function", error);
        }
      };
  }, [fnRef]);                // Effect runs once, fnRef is stable and does not change
};

export default useOnDismount;