/**
 * Class representing the current GPS position and providing utilities to watch for position changes.
 * Extends GeoCoordinates with EventEmitter capabilities.
 *
 * @class CurrentGpsPosition
 * @extends {GeoCoordinates}
 * @mixes EventEmitterMixin
 *
 * @param {boolean} [watchNow=false] - Whether to start watching the position immediately.
 * @param {...any} args - Additional arguments passed to the GeoCoordinates constructor.
 *
 * @property {boolean} watching - Indicates whether the position is currently being watched.
 *
 * @fires 'positionchange' - Emitted when the position changes beyond the specified precision.
 * @fires 'error' - Emitted when an error occurs during geolocation.
 * @fires 'startWatching' - Emitted when watching for position starts.
 * @fires 'stopWatching' - Emitted when watching for position stops.
 * @fires 'destroy' - Emitted when the instance is destroyed.
 *
 * @method destroy - Cleans up the instance, stops watching, and removes all event listeners.
 * @method startWatching - Begins watching the GPS position with optional precision and options.
 * @method stopWatching - Stops watching the GPS position.
 *
 * @example
 * const gps = new CurrentGpsPosition(true);
 * gps.on('positionchange', ({ latitude, longitude }) => {
 *   console.log('New position:', latitude, longitude);
 * });
 */
export default class CurrentGpsPosition extends GeoCoordinates {
    constructor(watchNow: boolean, precision: any, options: any, ...args: any[]);
    destroy(): void;
    set watching(value: boolean);
    get watching(): boolean;
    startWatching(options: any, precision: any): this;
    stopWatching(): this;
    #private;
}
import GeoCoordinates from "./GeoCoordinates";
