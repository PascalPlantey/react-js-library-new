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
 * @param {Function} fn - The callback function to execute when the back button is pressed.
 *
 * @example
 * useBackButton(() => {
 *   // Custom back button logic
 * });
 */
const useAndroidBackButton = fn => {
  useEffect(() => {
    if (isCapacitorAvailable()) {
      _backButtonCallbacks.push(fn);

      if (!_backButtonListenerRegistered) {
        App.addListener('backButton', (...args) => {
          const fn = _backButtonCallbacks.last();
          if (isFunction(fn)) fn(...args);
        });

        _backButtonListenerRegistered = true;
      }

      return () => {
        const idx = _backButtonCallbacks.lastIndexOf(fn);
        if (idx !== -1) _backButtonCallbacks.splice(idx, 1);

        if (_backButtonCallbacks.length === 0 && _backButtonListenerRegistered) {
          // App is closing, we can safely remove all listeners
          App.removeAllListeners();
          _backButtonListenerRegistered = false;
        }
      };
    }
  }, [fn]);
};

export default useAndroidBackButton;