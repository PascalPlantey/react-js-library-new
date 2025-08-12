import { useEffect } from 'react';

import { App } from '@capacitor/app';

import { useBoolean } from "../utils";
import useEventListener from './useEventListener';

import { isCapacitorAvailable } from '../../tools/browser';

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
  const { value : visible, setValue } = useBoolean(document.visibilityState === 'visible');

  useEventListener('visibilitychange', () => setValue(document.visibilityState === 'visible'), document);

  useEffect(() => {
    let appListener;
    if (isCapacitorAvailable())
      appListener = App.addListener('appStateChange', ({ isActive }) => setValue(isActive));

    return () => {
      if (appListener && typeof appListener.remove === "function")
        appListener.remove();
    };
  }, [setValue]);

  return visible;
};

export default useVisibility;