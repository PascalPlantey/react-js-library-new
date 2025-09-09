import { useEffect } from "react";

import { App } from '@capacitor/app';

import ExtArray from '../../tools/classes/ExtArray';
import isCapacitorAvailable from '../../tools/browser/isCapacitorAvailable';
import isFunction from '../../tools/is/isFunction';

const _backButtonCallbacks = new ExtArray();
let _backButtonListenerRegistered = false;

/**
 * Custom React hook to handle the device back button event, primarily for Capacitor-based apps.
 * Registers the provided callback function to be invoked when the back button is pressed.
 * Handles multiple callbacks and ensures proper cleanup on component unmount.
 *
 * @param {Function} fn - The callback function to execute when the back button is pressed (should be stable)
 *
 * @example
 * useBackButton(() => {
 *   // Custom back button logic
 * });
 */
const useAndroidBackButton = fn => {
  console.assert(isFunction(fn), 'useAndroidBackButton: The provided argument is not a function.');

  useEffect(() => {
    if (isCapacitorAvailable()) {
      _backButtonCallbacks.push(fn);

      if (!_backButtonListenerRegistered) {
        // Callback will be the last registered function at any point of time provided fn is stable
        App.addListener('backButton', (...args) => {
          const fn = _backButtonCallbacks.last();
          fn(...args);
        });

        _backButtonListenerRegistered = true;
      }

      return () => {
        const idx = _backButtonCallbacks.lastIndexOf(fn);

        // Removing a callback that is not the last one added can break the stack order, probably due to an unstable function
        if (idx !== _backButtonCallbacks.length - 1)
          console.warn('useAndroidBackButton: breaking the stack order, make sure the provided function is stable (e.g. using useCallback)');

        if (idx !== -1) _backButtonCallbacks.splice(idx, 1);

        // No more callbacks, remove listener
        if (_backButtonCallbacks.length === 0 && _backButtonListenerRegistered) {
          App.removeAllListeners();
          _backButtonListenerRegistered = false;
        }
      };
    }
  }, [fn]);
};

export default useAndroidBackButton;