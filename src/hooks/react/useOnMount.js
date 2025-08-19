import { useEffect } from 'react';

import useLast from './useLast';

import isFunction from '../../tools/is/isFunction';

/**
 * Hook that executes code once after the component has been mounted
 *
 * @param {() => void} fn - Callback function
 * @returns {void}
 *
 * @example
 * // Basic usage
 * src\hooks\react\useOnMount(() => console.log('callback'));
 */
const useOnMount = fn => {
  const fnRef = useLast(fn);

  useEffect(() => {
    if (!isFunction(fnRef.current))
      console.warn('useOnMount: Expected a function, received:', typeof fnRef.current);
    else
      fnRef.current();
  }, [fnRef]);
};

export default useOnMount;