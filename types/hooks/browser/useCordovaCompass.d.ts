export default useCordovaCompass;
/**
 * Custom hook to manage compass logic with device capability detection
 *
 * @param {boolean} [active=false] - Whether the hook should be active
 * @param {number} throttleMs - Throttle interval for orientation updates
 * @returns {{ isAvailable: boolean|null, isActive: boolean, displayAngle: number, orientation: number }} Compass state
 *
 * where
 * - `isAvailable` indicates if the compass is supported (null = detection in progress, true/false = definitive result),
 * - `isActive` indicates if the compass is currently active,
 * - `displayAngle` is the accumulated angle for CSS rotation,
 * - `orientation` is the latest absolute orientation
 *
 * @remarks
 * The hook performs a one-time compass capability detection on mount using a Promise-based approach.
 * Once detection is complete, `isAvailable` will be set to true or false definitively.
 * The compass will only be activated if both `active` parameter is true and `isAvailable` is true.
 */
declare function useCordovaCompass(active?: boolean, throttleMs?: number): {
    isAvailable: boolean | null;
    isActive: boolean;
    displayAngle: number;
    orientation: number;
};
