export default useCurrentPosition;
/**
 * Custom React hook to track the user's current geolocation position.
 *
 * @param {Object} [options={ enableHighAccuracy: true, timeout: 1000, maximumAge: 30000 }] - Geolocation API options.
 * @param {Array<number>} [dflt=[48.8566, 2.3522]] - Default coordinates [latitude, longitude] to use as initial position.
 * @param {boolean} [active=true] - Whether to actively track the position or not.
 * @returns {{ position: number[], error: string }} An object containing the current position and any error message.
 *
 * @example
 * // Basic usage
 * const { position, error } = useCurrentPosition();
 *
 * @example
 * // With custom options
 * const { position, error } = useCurrentPosition({
 *   enableHighAccuracy: true,
 *   timeout: 10000,
 *   maximumAge: 60000
 * }, [45.7640, 4.8357], true);
 */
declare function useCurrentPosition(options?: any, dflt?: Array<number>, active?: boolean): {
    position: number[];
    error: string;
};
