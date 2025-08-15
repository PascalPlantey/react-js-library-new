export default useSpeedoMeter;
/**
 * Custom React hook to calculate the instantaneous speed and bearing angle between position updates
 *
 * @param {GeoCoordinates} position - The current position object. Must implement `isSameAs`,
 * `getBearingTo`, and `getDistanceTo` methods
 * @returns {{ speed: number, angle: number }} - The current speed in km/h and bearing angle
 * in degrees, or 0 after 500ms of no movement
 *
 * @example
 * const { speed, angle } = useSpeedoMeter(currentPosition);
 */
declare function useSpeedoMeter(position: GeoCoordinates, timeoutMS?: number, every?: number): {
    speed: number;
    angle: number;
};
import GeoCoordinates from "../../tools/classes/GeoCoordinates.js";
