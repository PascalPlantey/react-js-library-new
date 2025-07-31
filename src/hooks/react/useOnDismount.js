import { useEffect } from 'react';

import useLast from './useLast';

import { isFunction } from '../../tools/is';

/**
 * Custom React hook that invokes a callback function when the component is unmounted.
 *
 * @param {Function} fn - The function to be called on component unmount.
 */
const useOndismount = fn => {
  const fnRef = useLast(fn);  // Stable ref that always points to latest fn

  useEffect(() => {
    // Return cleanup function that will run on unmount
    return () => {
      if (isFunction(fnRef.current)) {
        try {
          fnRef.current();
        } catch (error) {
          console.error("Error during onDismount:", error);
        }
      } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        console.warn("useOndismount: Provided callback is not a function:", typeof fnRef.current);
      }
    };
  }, [fnRef]);                // Effect runs once, fnRef is stable and does not change
};

export default useOndismount;