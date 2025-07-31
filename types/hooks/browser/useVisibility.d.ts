export default useVisibility;
export type UseVisibilityReturn = {
    /**
     * - Whether page is currently visible
     */
    isVisible: boolean;
    /**
     * - Current visibility state
     */
    visibilityState: DocumentVisibilityState;
};
/**
 * @typedef {Object} UseVisibilityReturn
 * @property {boolean} isVisible - Whether page is currently visible
 * @property {DocumentVisibilityState} visibilityState - Current visibility state
 */
/**
 * Custom React hook that tracks the visibility state of the document.
 *
 * Uses the Page Visibility API to determine if the page is currently visible to the user.
 * Returns a boolean indicating whether the document is visible.
 *
 * @returns {boolean} `true` if the document is visible, `false` otherwise.
 *
 * @example
 * const isVisible = useVisibility();
 * if (isVisible) {
 *   // Page is visible
 * }
 */
declare function useVisibility(): boolean;
