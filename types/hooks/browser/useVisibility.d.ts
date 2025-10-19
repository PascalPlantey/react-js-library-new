export default useVisibility;
/**
 * Custom React hook that tracks the visibility state of the document/app
 *
 * Uses the Page Visibility API to determine if the page/app is currently visible to the user
 * On Android/iOS with Capacitor, it also listens to app state changes
 * Returns a boolean indicating whether the document/app is visible
 *
 * @returns {boolean} `true` if the document/app is visible, `false` otherwise
 *
 * @example
 * const isVisible = useVisibility();
 * if (isVisible) {
 *   // Page is visible
 * }
 */
declare function useVisibility(): boolean;
