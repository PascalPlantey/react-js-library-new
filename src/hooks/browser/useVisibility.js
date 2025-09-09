import { useEffect } from 'react';

import { App } from '@capacitor/app';

import useBoolean from '../utils/useBoolean';
import useEventListener from './useEventListener';

import isCapacitorAvailable from '../../tools/browser/isCapacitorAvailable';
import isFunction from '../../tools/is/isFunction';

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
const useVisibility = () => {
  const { value : visible, setValue } = useBoolean(document.visibilityState === 'visible');

  useEventListener('visibilitychange', () => setValue(document.visibilityState === 'visible'), document);

  useEffect(() => {
    let appListener;
    if (isCapacitorAvailable()) {
      appListener = App.addListener('appStateChange', ({ isActive }) => setValue(isActive));

      return appListener.remove;
    }
  }, [setValue]);

  return visible;
};

export default useVisibility;