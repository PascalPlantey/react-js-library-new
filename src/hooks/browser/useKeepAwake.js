import { useCallback, useEffect, useState } from "react";

import { KeepAwake } from "@capacitor-community/keep-awake";

import isCapacitorAvailable from "../../tools/browser/isCapacitorAvailable";

/**
 * React hook that prevents the device from sleeping with pause/resume control.
 * Works on native platforms using Capacitor and the KeepAwake plugin.
 * 
 * @param {boolean} [initiallyActive=true] - Whether to start with keep awake enabled
 * @returns {object} { isActive: boolean, activate: function, deactivate: function }
 * @example
 * const { isActive, activate, deactivate } = useKeepAwake(); // Active at startup
 */
const useKeepAwake = (initiallyActive = true) => {
  const [isActive, setIsActive] = useState(false);
  const capacitorAvailable = isCapacitorAvailable();

  const keepAwake = useCallback(() => {
    if (!capacitorAvailable) return;

    setIsActive(prev => {
      if (prev === false) KeepAwake.keepAwake();
      return true;
    });

  }, [capacitorAvailable]);

  const allowSleep = useCallback(() => {
    if (!capacitorAvailable) return;

    setIsActive(prev => {
      if (prev === true) KeepAwake.allowSleep();
      return false;
    });

  }, [capacitorAvailable]);

  // Initial setup and final cleanup
  useEffect(() => {
    if (!capacitorAvailable) return;

    if (initiallyActive) keepAwake();

    return () => allowSleep();
  }, [capacitorAvailable, initiallyActive, keepAwake, allowSleep]);

  return {
    isKeepAwake: capacitorAvailable ? isActive : false,
    keepAwake,
    allowSleep,
  };
};

export default useKeepAwake;