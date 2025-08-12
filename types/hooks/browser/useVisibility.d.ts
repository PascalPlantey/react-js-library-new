export default useVisibility;
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
