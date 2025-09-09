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
  console.assert(isFunction(fn), 'useOnDismount: The provided argument is not a function.');

  const fnRef = useLast(fn);  // Stable ref that always points to latest fn
  const resultRef = useRef();

  useEffect(() => {
    const fn = fnRef.current;

    return () => resultRef.current = fn();
  }, [fnRef]);                // Effect runs once, fnRef is stable and does not change

  return resultRef.current;
};

export default useOnDismount;