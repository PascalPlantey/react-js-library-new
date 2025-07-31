export default useWindowSize;
export type WindowSize = {
    /**
     * - Window width in pixels
     */
    width: number;
    /**
     * - Window height in pixels
     */
    height: number;
};
export type UseWindowSizeOptions = {
    /**
     * - Minimum resize pixels to trigger update
     */
    step?: number;
    /**
     * - Start listening immediately
     */
    immediately?: boolean;
};
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
declare function useWindowSize(step?: number, immediately?: boolean): {
    width: number;
    height: number;
};
