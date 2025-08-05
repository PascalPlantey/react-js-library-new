export default useDeviceOrientation;
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
declare function useDeviceOrientation(active?: boolean): number | undefined;
