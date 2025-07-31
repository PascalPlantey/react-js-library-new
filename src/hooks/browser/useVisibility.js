import { useBoolean } from "../utils";
import useEventListener from './useEventListener';

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
const useVisibility = () => {
  const [visible, { setValue }] = useBoolean(document.visibilityState === 'visible');
  useEventListener('visibilitychange', () => setValue(document.visibilityState === 'visible'), document);

  return visible;
};

export default useVisibility;