import { useState } from 'react';

import useEventListener from './useEventListener';

/**
 * @typedef {Object} WindowSize
 * @property {number} width - Window width in pixels
 * @property {number} height - Window height in pixels
 */

/**
 * @typedef {Object} UseWindowSizeOptions
 * @property {number} [step=30] - Minimum resize pixels to trigger update
 * @property {boolean} [immediately=true] - Start listening immediately
 */
/**
 * Custom React hook that returns the current window size (width and height).
 * It updates the state only if the window size changes by at least the specified step value.
 *
 * @param {number} [step=30] - Minimum number of pixels the window must be resized by (in either width or height) to trigger a state update.
 * @param {boolean} [immediately=true] - Whether to start listening to the resize event immediately.
 * @returns {{ width: number, height: number }} An object containing the current window width and height.
 */
const useWindowSize = (step = 30, immediately = true) => {
  const makeSize = () => {                                          // Helper
    if (typeof window === 'undefined')  return { width: 0, height: 0 };
    else                                return { width: window.innerWidth, height: window.innerHeight };
  };

  const [size, setSize] = useState(makeSize);
  const { height, width } = size;

  const onResize = () => setSize(current => {
    const { height, width } = current;
    if (Math.abs(window.innerWidth - width) >= step || Math.abs(window.innerHeight - height) >= step)
      return makeSize();
    else
      return current;                                               // Unchanged ==> no state change ==> no render
  });

  useEventListener('resize', onResize, window, immediately);

  return ({ height, width });
};

export default useWindowSize;