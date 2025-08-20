export default useGpsCoordinates;
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
declare function useGpsCoordinates(dflt: GeoCoordinates | any[] | any, options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}, active?: boolean, precision?: number): {
    coordinates: GeoCoordinates | any[] | any;
    error: string | null;
};
import GeoCoordinates from '../../tools/classes/GeoCoordinates';
