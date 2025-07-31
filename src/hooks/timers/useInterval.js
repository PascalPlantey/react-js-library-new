import { useCallback, useRef } from 'react';

import { useBoolean } from '../utils';
import { useLast, useOnDismount, useOnMount } from '../react';

/**
 * Execute callback every interval ms
 * @param {function} callback Function to be executed () => any
 * @param {number} [interval=1000] Render every interval ms
 * @param {boolean} [immediately=true] Start immediately?
 * @returns {object} { working, toggle: () => void, stop: () => void, start: () => void }
 */
const useInterval = (callback, interval = 1000, immediately = true) => {
  const timer = useRef();                                           // Interval timer
  const fn = useLast(callback);                                     // Last callback function
  const [working, { setFalse, setTrue }] = useBoolean(immediately);

  const handleStop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = undefined;
      setFalse(); // Set working to false
    }
  }, [setFalse]);

  const handleStart = useCallback(() => {
    if (!timer.current) {
      timer.current = setInterval(fn.current, interval);
      setTrue(); // Set working to true
    }
  }, [fn, interval, setTrue]);

  const handleToggle = useCallback(
    () => working ? handleStop() : handleStart()
  , [working, handleStart, handleStop]);

  useOnMount(() => immediately && handleStart());
  useOnDismount(() => clearInterval(timer.current));                // No state change on dismounting

  return({
    working,
    toggle: handleToggle,
    stop: handleStop,
    start: handleStart
  });
};

export default useInterval;