export default useSpeedoMeter;
/**
 * Custom React hook to calculate speed and bearing angle between position updates.
 *
 * @param {Object} position - The current position object, expected to have `getBearingTo` and `getDistanceTo` methods
 * @param {number} [minSpeed=1] - Minimum accumulated distance (in km) before updating speed
 * @param {number} [minTime=5] - Minimum accumulated time (in hours) before updating speed
 * @returns {{ speed: number, angle: number }} - The current speed (km/h) and bearing angle (degrees)
 */
declare function useSpeedoMeter(position: any, minSpeed?: number, minTime?: number): {
    speed: number;
    angle: number;
};
