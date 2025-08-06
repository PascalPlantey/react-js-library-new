import { useState, useEffect, useRef } from "react";

import { DeviceOrientation } from "@ionic-native/device-orientation";

/**
 * Custom React hook to get the device's orientation (alpha value)
 * 
 * Uses Capacitor's Motion plugin if available, otherwise falls back to the browser's
 * `deviceorientation` event. The hook listens for orientation changes when `active` is true
 *
 * @param {boolean} [active=true] - Whether to actively listen for orientation changes
 * @param {number} [throttleMs=100] - Minimum time (in ms) between updates
 * @returns {number|undefined} The current device orientation (angle value), or `undefined` if not available
 */
const useDeviceCompass = (active = true, throttleMs = 100) => {
  const [orientation, setOrientation] = useState();
  const lastUpdateRef = useRef(0); // To track the last update time

  useEffect(() => {
    let subscription;

    const throttledSetOrientation = newOrientation => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= throttleMs) {
        lastUpdateRef.current = now;
        setOrientation(newOrientation);
      }
    };

    if (active && DeviceOrientation.watchHeading) {
      // Use DeviceOrientation plugin if available
      subscription = DeviceOrientation.watchHeading().subscribe(
        data => throttledSetOrientation(data.magneticHeading),
        error => { throw new Error("Error watching device orientation:", error) }
      );

      return () => subscription?.unsubscribe();

    } else if (active) {
      // Fallback to browser's deviceorientationabsolute event
      const handleOrientation = event => {
        const alpha = event.alpha;
        if (alpha !== null) {
          throttledSetOrientation(alpha);
        }
      };

      const eventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
      window.addEventListener(eventName, handleOrientation);

      return () => window.removeEventListener(eventName, handleOrientation);
    }
  }, [active, throttleMs]);

  return orientation;
};

export default useDeviceCompass;