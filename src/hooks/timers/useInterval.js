import { useCallback, useState } from 'react';

import useLast from '../react/useLast';
import useOnMount from '../react/useOnMount';
import useOnDismount from '../react/useOnDismount';

/**
 * Execute callback every interval ms
 * @param {function} callback Function to be executed () => any
 * @param {number} [interval=1000] Render every interval ms
 * @param {boolean} [immediately=true] Start immediately?
 * @returns {object} { working, toggle: () => void, stop: () => void, start: () => void }
 */
const useInterval = (callback, interval = 1000, immediately = true) => {
  const [timer, setTimer] = useState();
  const fn = useLast(callback);                     // Last version of the callback function

  const stop = useCallback(() =>
    setTimer(prev => {
      if (prev) {
        clearInterval(prev);
        return undefined;
      }
      else
        return prev;
    })
  , []);

  const start = useCallback(() => 
    setTimer(prev => {
      if (prev)
        return prev;                                // Already running, do nothing
      else
        return setInterval(fn.current, interval);   // Start new timer
    })
  , [fn, interval]);

  const toggle = useCallback(
    () => timer ? stop() : start()
  , [timer, start, stop]);

  useOnMount(() => immediately && start());
  useOnDismount(stop);

  return({
    working: timer !== undefined,
    toggle,
    stop,
    start
  });
};

export default useInterval;