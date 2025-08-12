export default detectCordovaCompassCapability;
/**
 * Detects if the device has compass capabilities with a timeout-based approach.
 *
 * @param {number} timeoutMs - Maximum time to wait for compass detection (default: 3000ms)
 * @returns {Promise<boolean>} Promise that resolves to true if compass is available, false otherwise
 */
declare function detectCordovaCompassCapability(timeoutMs?: number): Promise<boolean>;
