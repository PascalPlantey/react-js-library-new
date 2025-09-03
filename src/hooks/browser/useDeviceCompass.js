import { useState, useEffect, useRef } from "react";

import useVisibility from "./useVisibility";

/**
 * Custom React hook to get the device's orientation (alpha value)
 * 
 * Uses native Cordova compass API if available, otherwise falls back to the browser's
 * `deviceorientation` event. The hook listens for orientation changes when `active` is true
 * and the app is visible. 
 * 
 * Automatically handles app visibility transitions; the mobile might stop the sensor updates causing the watchHeading
 * to stop (and not recover) receiving updates when the app goes to background or sleep
 * - Stops listening when app goes to background/sleep
 * - Restarts listening when app becomes visible again
 * 
 * This ensures reliable compass behavior across device sleep/wake cycles without
 * requiring external visibility management.
 *
 * @param {boolean} [active=true] - Whether to actively listen for orientation changes
 * @param {number} [throttleMs=100] - Minimum time (in ms) between updates
 * @returns {number|undefined} The current device orientation (angle value), or `undefined` if not available (hardware problem
 * or hook is inactive/starting)
 */
const useDeviceCompass = (active = true, throttleMs = 100) => {
  const [orientation, setOrientation] = useState();
  const lastUpdateRef = useRef(0);                      // To track the last update time (throttle)

  const appVisible = useVisibility();                   // Track app visibility for reset on sleep/wake
  const wasAppVisibleRef = useRef(appVisible);          // Track previous app visibility state changes
  
  // Combine user active state with app visibility for true compass activity
  const reallyActive = active && appVisible;

  useEffect(() => {
    const throttledSetOrientation = (newOrientation, timestamp) => {
      if (timestamp - lastUpdateRef.current >= throttleMs) {
        lastUpdateRef.current = timestamp;
        setOrientation(newOrientation);
      }
    };

    wasAppVisibleRef.current = appVisible;              // Update app visibility tracking

    if (!reallyActive) {
      // Reset orientation to undefined when inactive to force fresh detection on reactivation
      setOrientation(undefined);
      lastUpdateRef.current = 0;
      return;
    }

    // Use native Cordova compass API directly (more reliable than Ionic wrapper)
    if (reallyActive && window.cordova && navigator?.compass?.watchHeading) {
      const watchID = navigator.compass.watchHeading(
        ({ magneticHeading, timestamp }) => throttledSetOrientation(magneticHeading, timestamp),
        error => console.error("Native Cordova compass error:", error),
        { frequency: throttleMs }
      );

      return () => navigator.compass.clearWatch(watchID);
    }

    // Fallback to browser's deviceorientationabsolute event
    else if (reallyActive) {
      const handleOrientation = ({ alpha }) => {
        if (alpha !== null)
          throttledSetOrientation(alpha, Date.now());
      };

      // Trying to get 'ondeviceorientationabsolute' as the other event is not a magnetic absolute orientation
      const eventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
      window.addEventListener(eventName, handleOrientation);

      return () => window.removeEventListener(eventName, handleOrientation);
    }
  }, [active, appVisible, throttleMs, reallyActive]);

  return orientation;
};

export default useDeviceCompass;