export default useDeviceCompass;
/**
 * Custom React hook to get the device's orientation (alpha value)
 *
 * Uses native Cordova compass API if available, otherwise falls back to the browser's
 * `deviceorientation` event. The hook listens for orientation changes when `active` is true
 * and the app is visible.
 *
 * Automatically handles app visibility transitions; the mobile might stop the sensor updates causing the watchHeading
 * to stop (and not recover) receiving updates when the app goes to background or sleep
 * - Stops listening when app goes to background/sleep
 * - Restarts listening when app becomes visible again
 *
 * This ensures reliable compass behavior across device sleep/wake cycles without
 * requiring external visibility management.
 *
 * @param {boolean} [active=true] - Whether to actively listen for orientation changes
 * @param {number} [throttleMs=100] - Minimum time (in ms) between updates
 * @returns {number|undefined} The current device orientation (angle value), or `undefined` if not available (hardware problem
 * or hook is inactive/starting)
 */
declare function useDeviceCompass(active?: boolean, throttleMs?: number): number | undefined;
