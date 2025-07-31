export default useGpsCoordinates;
/**
 * Custom React hook to obtain and watch GPS coordinates using the browser's Geolocation API.
 *
 * @param {Object} [options={ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }] - Geolocation API options
 * @param {boolean} [active=true] - Whether to actively watch for position changes
 * @param {number} [precision=0] - Precision for updating coordinates on position change, in meters
 * @returns {{ coordinates: GeoCoordinates | undefined, error: (string|null) }} An object containing the current coordinates and any error message
 * { coordinates, error }
 */
declare function useGpsCoordinates(dflt: any, options?: any, active?: boolean, precision?: number): {
    coordinates: GeoCoordinates | undefined;
    error: (string | null);
};
import { GeoCoordinates } from '../../tools/classes';
