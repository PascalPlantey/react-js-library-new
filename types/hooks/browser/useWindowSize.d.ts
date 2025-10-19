export default useWindowSize;
/**
 * Custom React hook that returns the current window size (width and height).
 * It updates the state only if the window size changes by at least the specified step value.
 *
 * @param {number} [step=30] - Minimum number of pixels the window must be resized by (in either width or height) to trigger a state update.
 * @param {boolean} [immediately=true] - Whether to start listening to the resize event immediately.
 * @returns {{ width: number, height: number }} An object containing the current window width and height.
 */
declare function useWindowSize(step?: number, immediately?: boolean): {
    width: number;
    height: number;
};
