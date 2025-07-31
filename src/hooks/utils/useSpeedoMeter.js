import { useRef, useState } from "react";

import GeoCoordinates from "../../tools/classes/GeoCoordinates.js";

/**
 * Hook React pour calculer la vitesse instantanée à partir de positions GPS successives.
 * @param {GeoCoordinates} position - Objet { latitude, longitude, timestamp }
 * @returns {number} Vitesse en m/s (ou null si pas assez de données)
 */
const useSpeedoMeter = position => {
  const newPosition = new GeoCoordinates(position);
  const last = useRef({ position: null, timestamp: null });
  const [speed, setSpeed] = useState(0);

  const now = Date.now();

  if (last.current) {
    const { position: lastPosition, timestamp: lastTimestamp } = last.current;
    const distance = newPosition.getDistanceTo(lastPosition);
    const time = (now - lastTimestamp) / 1000; // en secondes
    if (time > 0) setSpeed(distance / time);
  }

  last.current = { position: newPosition, timestamp: now };

  return speed;
};

export default useSpeedoMeter;