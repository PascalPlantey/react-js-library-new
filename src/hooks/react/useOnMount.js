import { useEffect, useRef } from 'react';

import { isFunction } from '../../tools/is';

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
  const init = useRef(fn);
  useEffect(() => { isFunction(init.current) && init.current(); }, []);
};

export default useOnMount;