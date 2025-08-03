import { useCallback, useState } from 'react';

import { useLast, useOnDismount, useOnMount } from '../react';

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

  const handleStop = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(undefined);
    }
  }, [setTimer]);

  const handleStart = useCallback(() => {
    if (!timer)
      setTimer(setInterval(fn.current, interval));
  }, [fn, interval, setTimer]);

  const handleToggle = useCallback(
    () => timer ? handleStop() : handleStart()
  , [timer, handleStart, handleStop]);

  useOnMount(() => immediately && handleStart());
  useOnDismount(() => {
    timer && clearInterval(timer);
    setTimer(undefined);                            // In strict mode, this is necessary to avoid remount issues
  });

  return({
    working: timer !== undefined,
    toggle: handleToggle,
    stop: handleStop,
    start: handleStart
  });
};

export default useInterval;