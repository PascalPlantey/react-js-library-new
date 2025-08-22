import { useRef, useEffect } from 'react';

import useLast from './useLast';

import isFunction from '../../tools/is/isFunction';

/**
 * Hook that executes code once (and only once) after the component has been mounted
 *
 * @param {() => void} fn - Callback function
 * @returns {*} - The return value of the callback function (stable, will not change)
 *
 * @example
 * // Basic usage
 * src\hooks\react\useOnMount(() => console.log('callback'));
 */
const useOnMount = fn => {
  const fnRef = useLast(fn);
  const resultRef = useRef();

  useEffect(() => {
    if (!isFunction(fnRef.current))
      console.warn('useOnMount: Expected a function, got:', typeof fnRef.current);
    else
      resultRef.current = fnRef.current();
  }, [fnRef]);

  return resultRef.current;
};

export default useOnMount;