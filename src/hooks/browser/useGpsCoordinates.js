import { useState, useEffect, useRef } from 'react';

import { GeoCoordinates } from '../../tools/classes';

/**
 * Custom React hook to obtain and watch GPS coordinates using the browser's Geolocation API.
 *
 * @param {Object} [options={ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }] - Geolocation API options
 * @param {boolean} [active=true] - Whether to actively watch for position changes
 * @param {number} [precision=0] - Precision for updating coordinates on position change, in meters
 * @returns {{ coordinates: GeoCoordinates | undefined, error: (string|null) }} An object containing the current coordinates and any error message
 * { coordinates, error }
 */
const useGpsCoordinates = (
  dflt,
  options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
  active = true,
  precision = 0
) => {
  const [coordinates, setCoordinates] = useState(dflt);
  const [error, setError] = useState(null);
  const optionsRef = useRef(options);
  const watchIdRef = useRef(null);

  const handleError = ({ code, message }) => {
    if (code !== 3)
      console.warn(`Geolocation error ${code}: ${message}`);
    setError(message);
  };

  useEffect(() => {
    if (!navigator.geolocation)
      handleError({ code: 0, message: "La géolocalisation n'est pas supportée par cet appareil" });
    else if (!active) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    } else {
      const handlePositionChange = ({ coords: { latitude, longitude } }) => {
        const newPos = new GeoCoordinates([latitude, longitude]);
        if (!coordinates || !coordinates.isSameAs(newPos, precision))
          setCoordinates(newPos);
        setError(null);
      };

      navigator.geolocation.getCurrentPosition(                 // Hope to get a quick position
        handlePositionChange,
        handleError,
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 1000 * 60 * 15
        }
      );

      watchIdRef.current = navigator.geolocation.watchPosition( // Watch for position changes
        handlePositionChange,
        handleError,
        optionsRef.current
      );

      return () => navigator.geolocation.clearWatch(watchIdRef.current);
    }
  }, [active, precision, coordinates]);

  return { coordinates, error };
};

export default useGpsCoordinates;