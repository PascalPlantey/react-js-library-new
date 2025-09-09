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
  console.assert(isFunction(fn), 'useOnMount: The provided argument is not a function.');

  const fnRef = useLast(fn);
  const resultRef = useRef();

  useEffect(() => {
    resultRef.current = fnRef.current();
  }, [fnRef]);

  return resultRef.current;
};

export default useOnMount;