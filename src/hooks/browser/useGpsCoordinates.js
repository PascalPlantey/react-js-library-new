import { useState, useEffect } from 'react';

import useOnDismount from '../react/useOnDismount';
import useNewClassRef from '../utils/useNewClassRef';

import noop from '../../tools/misc/noop';

import GeoCoordinates from '../../tools/classes/GeoCoordinates';
import CurrentGpsPosition from '../../tools/classes/CurrentGpsPosition';

/**
 * Custom React hook to watch and retrieve GPS coordinates.
 *
 * @param {GeoCoordinates|Array|Object} dflt - The default coordinates to use before a position is acquired.
 * @param {Object} [options] - Geolocation options.
 * @param {boolean} [options.enableHighAccuracy=true] - Indicates if high accuracy is desired.
 * @param {number} [options.timeout=2000] - Maximum time (ms) to wait for a position.
 * @param {number} [options.maximumAge=0] - Maximum age (ms) of cached position.
 * @param {boolean} [active=true] - Whether to actively watch for position changes.
 * @param {number} [precision=0] - Precision for comparing coordinates.
 * @returns {{ coordinates: GeoCoordinates|Array|Object, error: string|null }} An object containing the current coordinates and any error message.
 */
const useGpsCoordinates = (
  dflt,
  options = { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 },
  active = true,
  precision = 0
) => {
  const [coordinates, setCoordinates] = useState(dflt);
  const [error, setError] = useState(null);

  const currentPosition = useNewClassRef(() =>
    new CurrentGpsPosition(false, precision, options, dflt)                                 // Start inactive
    .on('error'         , 'useGpsCoordinates', error        => setError(error))
    .on('positionchange', 'useGpsCoordinates', geolocation  => setCoordinates(geolocation))
  );

  useEffect(() => {
    if (currentPosition.watching !== active)                                                // Check also done in CurrentGpsPosition
      currentPosition.watching = active;                                                    // Let the effect manage the active status
  }, [active, currentPosition]);

  useOnDismount(currentPosition.current?.destroy || noop);

  return { coordinates, error };
};

export default useGpsCoordinates;