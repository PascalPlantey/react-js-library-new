import { useState, useEffect, useRef } from 'react';

import { Geolocation } from '@capacitor/geolocation';

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

  useEffect(() => {
    const handlePositionChange = ({ coords: { latitude, longitude } }) => {
      const newPos = new GeoCoordinates([latitude, longitude]);
      setCoordinates(prev =>
        !prev || !prev.isSameAs(newPos, precision) ? newPos : prev
      );
      if (error) setError(null);
    };

    const handleError = ({ code, message }) => {
      if (code !== 3)
        console.warn(`Geolocation error ${code}: ${message}`);
      setError(message);
    };

    const clearWatch = () => {
      if (watchIdRef.current) {
        Geolocation
          ? Geolocation.clearWatch({ id: watchIdRef.current })
          : navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };

    if (!Geolocation && !navigator.geolocation)
      return handleError({ code: 0, message: "La géolocalisation n'est pas supportée par cet appareil" });

    else if (!active)                   // Stop watching requested
      return clearWatch();

    else if (Geolocation)               // Trying with Capacitor
      Geolocation.watchPosition(
        optionsRef.current,
        (position, error) => error ? handleError(error) : handlePositionChange(position)
      ).then(watchId => {
        watchIdRef.current = watchId;
      });

    else                                // Fallback to browser's Geolocation API
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionChange,
        handleError,
        optionsRef.current
      );

    return clearWatch;
  }, [active, error, precision]);

  return { coordinates, error };
};

export default useGpsCoordinates;