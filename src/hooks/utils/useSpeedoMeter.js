import { useRef, useState } from "react";

import GeoCoordinates from "../../tools/classes/GeoCoordinates.js";
import useOnDismount from "../react/useOnDismount.js";

/**
 * Custom React hook to calculate the instantaneous speed and bearing angle between position updates
 *
 * @param {GeoCoordinates} position - The current position object. Must implement `isSameAs`,
 * `getBearingTo`, and `getDistanceTo` methods
 * @returns {{ speed: number, angle: number }} - The current speed in km/h and bearing angle
 * in degrees, or 0 after 500ms of no movement
 *
 * @example
 * const { speed, angle } = useSpeedoMeter(currentPosition);
 */
const useSpeedoMeter = (position, timeoutMS = 2000, every = 0.3) => {
  const lastPos = useRef();
  const angle = useRef(0);
  const [speed, setSpeed] = useState(0);
  const timeoutRef = useRef();

  const now = Date.now();

  // Calculate speed only if position changes
  if (lastPos.current && !lastPos.current.position.isSameAs(position)) {
    const { position: lastPosition, timestamp: lastTimestamp } = lastPos.current;
    const distance = lastPosition.getDistanceTo(position);      // mètres
    const time = (now - lastTimestamp) / 1000;                  // secondes

    if (time > every) {
      angle.current = lastPosition.getBearingTo(position);
      const instantSpeed = (distance / 1000) / (time / 3600);   // km/h

      setSpeed(instantSpeed);
      lastPos.current = { position, timestamp: now };

      // Cancel previous timeout and restart one which sets speed to 0 after timeoutMS
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSpeed(0);
        lastPos.current = undefined;                            // Reset last position
        angle.current = 0;
      }, timeoutMS);
    }
  }
  else if (!lastPos.current)                                    // Initial last position
    lastPos.current = { position, timestamp: now };

  useOnDismount(() => clearTimeout(timeoutRef.current));

  return { speed, angle: angle.current };
};

export default useSpeedoMeter;