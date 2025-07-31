import { useRef, useCallback, useEffect } from 'react';

import { isFunction } from '../../tools/is';

import useTimer from './useTimer';
import { useLast } from '../react';

/**
 * Execute a function after initialSeconds has elapsed
 * @param {function} action Function to execute when time has elapsed : () => void
 * @param {number} runAfterSeconds Number of seconds before callback is executed
 * @param {boolean} immediately Start countdown immediately or after toggle()/reset() is called
 * @returns {useTimerResult} { remainingTime, working, toggle, reset }
 */
const useCountDown = (action, runAfterSeconds, immediately = true) => {
  const { working, remainingTime, toggle, reset } = useTimer(runAfterSeconds, 1000, immediately);
  const done = useRef(false);                           // callback action executed?
  const actionRef = useLast(action);                    // keep the last action reference

  const handleToggle = useCallback(() => done.current === false && toggle(), [toggle]);

  const handleReset = useCallback(() => {
    reset();
    done.current = false;
  }, [reset]);

  useEffect(() => {
    if (remainingTime === 0 && !done.current) {
      isFunction(actionRef.current) && actionRef.current();
      done.current = true;
    }
  }, [remainingTime, actionRef]);

  return({
    working,
    remainingTime,
    toggle: handleToggle,
    reset: handleReset,
  });
};

export default useCountDown;