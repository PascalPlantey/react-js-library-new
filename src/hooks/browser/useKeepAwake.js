import { useCallback, useEffect, useState } from "react";

import { KeepAwake } from "@capacitor-community/keep-awake";

import { isCapacitorAvailable } from "../../tools";

/**
 * @typedef {Object} UseKeepAwakeReturn
 * @property {boolean} isActive - Whether keep awake is currently active
 * @property {() => Promise<void>} activate - Activate keep awake
 * @property {() => Promise<void>} deactivate - Deactivate keep awake
 * @property {() => Promise<void>} toggle - Toggle keep awake state
 * @property {() => void} pause - Pause keep awake
 * @property {() => void} resume - Resume keep awake
 */
/**
 * React hook that prevents the device from sleeping with pause/resume control.
 * Works on native platforms using Capacitor and the KeepAwake plugin.
 * 
 * @param {boolean} [initiallyActive=true] - Whether to start with keep awake enabled
 * @returns {object} { isActive: boolean, activate: function, deactivate: function, toggle: function }
 * @example
 * const { isActive, activate, deactivate, toggle } = useKeepAwake();
 * const { isActive, toggle } = useKeepAwake(false); // Start inactive
 */
const useKeepAwake = (initiallyActive = true) => {
  const [isActive, setIsActive] = useState(initiallyActive);
  const capacitorAvailable = isCapacitorAvailable();

  const activate = useCallback(() => {
    if (capacitorAvailable) {
      KeepAwake.keepAwake();
      setIsActive(true);
    }
  }, [capacitorAvailable]);

  const deactivate = useCallback(() => {
    if (capacitorAvailable) {
      KeepAwake.allowSleep();
      setIsActive(false);
    }
  }, [capacitorAvailable]);

  const toggle = useCallback(() => isActive ? deactivate() : activate(), [isActive, activate, deactivate]);

  // Initial setup and cleanup
  useEffect(() => {
    if (capacitorAvailable && initiallyActive)
      activate();

    return () => {
      if (capacitorAvailable)
        deactivate();
    };
  }, [capacitorAvailable, initiallyActive, activate, deactivate]);

  // Handle state changes
  useEffect(() => {
    if (!capacitorAvailable) return;
    
    if (isActive) activate();
    else          deactivate();
  }, [isActive, capacitorAvailable, activate, deactivate]);

  return {
    isActive: capacitorAvailable ? isActive : false,
    activate,
    deactivate,
    toggle
  };
};

export default useKeepAwake;