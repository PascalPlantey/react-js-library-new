import { useRef, useEffect } from 'react';

/**
 * Returns true if this is the first render of the Component which uses the hook
 * @returns {boolean}
 * @memberof Hooks#
 */
const useIsFirstRender = () => {
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  return isFirstRenderRef.current;
};

export default useIsFirstRender;