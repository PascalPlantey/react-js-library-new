import { useCallback, useEffect, useState } from 'react';

import useInterval from './useInterval';

/**
 * Sends a render every intervalMs ms until `secondsUntilStop` comes to zero
 * @param {number} secondsUntilStop Number of seconds to wait before stopping
 * @param {boolean} [immediately=true] If true, starts immediately
 * @param {number} [intervalMs=1000] Interval in ms between each decrement
 * @returns {Object} Timer state and actions
 * @example
 * const { working, remainingTime, toggle, reset } = useTimer(10, true, 500); // décrémente toutes les 500ms
 */
const useTimer = (secondsUntilStop, intervalMs = 1000, immediately = true) => {
  const [remainingTime, setRemainingTime] = useState(secondsUntilStop);

  // Get a const function to avoid side effects on toggle & reset
  const intervalFn = () => setRemainingTime(prev => Math.max(prev - intervalMs / 1000, 0));

  const { working, toggle, stop, start } = useInterval(intervalFn, intervalMs, immediately);

  useEffect(() => {
    if (working && remainingTime === 0) stop();
  }, [working, remainingTime, stop]);

  // Toggle only if some time is left
  const handleToggle = useCallback(() => remainingTime > 0 && toggle(), [remainingTime, toggle]);

  // Reset to initial parameters (secondsUntilStop && immediately)
  const handleReset = useCallback(() => {
    setRemainingTime(secondsUntilStop);
    if (!working && immediately)
      start();
  }, [secondsUntilStop, working, immediately, start]);

  return({
    working,
    remainingTime,
    toggle: handleToggle,
    reset: handleReset
  });
};

export default useTimer;