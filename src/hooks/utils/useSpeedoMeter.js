import { useRef, useState } from "react";

import GeoCoordinates from "../../tools/classes/GeoCoordinates.js";

/**
 * Custom React hook to calculate speed and bearing angle between position updates.
 *
 * @param {Object} position - The current position object, expected to have `getBearingTo` and `getDistanceTo` methods
 * @param {number} [minSpeed=1] - Minimum accumulated distance (in km) before updating speed
 * @param {number} [minTime=5] - Minimum accumulated time (in hours) before updating speed
 * @returns {{ speed: number, angle: number }} - The current speed (km/h) and bearing angle (degrees)
 */
const useSpeedoMeter = (position, minSpeed = 1, minTime = 5) => {
  const distanceAcc = useRef(0),
        timeAcc = useRef(0),
        lastPos = useRef(),
        angle = useRef(0);
  const [speed, setSpeed] = useState(0);

  const now = Date.now();

  if (lastPos.current) {
    const { position: lastPosition, timestamp: lastTimestamp } = lastPos.current;

    angle.current = lastPosition.getBearingTo(position);            // Angle
    const distance = lastPosition.getDistanceTo(position) / 1000;   // km
    const time = (now - lastTimestamp) / 3600;                      // hours

    distanceAcc.current += distance;                                // Accumulated km
    timeAcc.current += time;                                        // Accumulated hours
    const speed = distance / time;                                  // km/h

    if (distanceAcc.current >= minSpeed && timeAcc.current >= minTime) {
      distanceAcc.current = 0;                                      // Reset accumulated distance
      timeAcc.current = 0;                                          // Reset accumulated time
      if (time > 0) setSpeed(speed);
    }
  }

  lastPos.current = { position, timestamp: now };

  return { speed, angle: angle.current };
};

export default useSpeedoMeter;