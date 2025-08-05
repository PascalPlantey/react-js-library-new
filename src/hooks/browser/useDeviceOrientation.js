import { useState, useEffect } from "react";

import { Motion } from "@capacitor/motion";

import { isCapacitorAvailable } from './../../tools/browser';


/**
 * Custom React hook to get the device's orientation (alpha value)
 * 
 * Uses Capacitor's Motion plugin if available, otherwise falls back to the browser's
 * `deviceorientation` event. The hook listens for orientation changes when `active` is true
 * 
 * The active parameter allows control over whether to actively listen for orientation changes
 *
 * @param {boolean} [active=true] - Whether to actively listen for orientation changes
 * @returns {number|undefined} The current device orientation (angle value), or `undefined` if not available
 */
const useDeviceOrientation = (active = true) => {
  const [orientation, setOrientation] = useState();

  const withCapacitor = isCapacitorAvailable();

  useEffect(() => {
    if (withCapacitor) {
      const startListening = async () => {
        await Motion.addListener("orientation", (event) => {
          const { alpha } = event;
          setOrientation(alpha !== null ? alpha : undefined);
        });
      };

      if (active) startListening();

      return () => Motion.removeAllListeners();
    }
  }, [active, withCapacitor]);

  useEffect(() => {
    if (!withCapacitor) {
      const handleOrientation = (event) => {
        const alpha = event.alpha;
        setOrientation(alpha !== null ? alpha : undefined);
      };

      if (active) window.addEventListener("deviceorientation", handleOrientation);

      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, [active, withCapacitor]);

  return orientation;
};

export default useDeviceOrientation;