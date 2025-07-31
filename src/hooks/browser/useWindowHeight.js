import useWindowSize from "./useWindowSize"

/**
 * Custom React hook that returns the current window height.
 * 
 * @param {number} step - The interval (in milliseconds) at which the window size is checked.
 * @returns {number} The current height of the window in pixels.
 */
const useWindowHeight = step => {
  const { height } = useWindowSize(step);
  return height;
};

export default useWindowHeight;