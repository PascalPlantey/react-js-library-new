import useWindowSize from "./useWindowSize";

/**
 * Custom React hook that returns the current window width.
 * 
 * @param {number} step - The interval (in pixels) at which the window size is measured.
 * @returns {number} The current width of the window.
 */
const useWindowWidth = step => {
  const { width } = useWindowSize(step);
  return width;
};

export default useWindowWidth;
