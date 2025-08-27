import { Geolocation } from '@capacitor/geolocation';

import isCapacitorAvailable from "../browser/isCapacitorAvailable";

import GeoCoordinates from "./GeoCoordinates";
import { EventEmitterMixin } from "./EventEmitter";

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
export default class CurrentGpsPosition extends EventEmitterMixin(GeoCoordinates) {
  #watchId = null;
  #precision = 0;
  #options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  constructor(watchNow = false, precision, options, ...args) {
    super(...args);
    if (precision) this.#precision = precision;
    if (options) this.#options = options;

    if (watchNow)
      this.startWatching(this.#options, this.#precision);
  }

  destroy() {
    this.stopWatching();
    this.offAll();
    this.emit('destroy');
  }

  get watching() {
    return this.#watchId !== null;
  }

  set watching(value) {
    value ? this.startWatching(this.#options, this.#precision) : this.stopWatching();
  }

  #handleNewPosition(position, precision) {
    const newPosition = new GeoCoordinates(position);

    if (this.getDistanceTo(newPosition) > precision ?? this.#precision) {
      this.from(newPosition);
      this.emit('positionchange', newPosition);
    }
  }

  startWatching(options, precision) {
    if (this.watching)
      ;

    else if (!Geolocation && !navigator.geolocation)
      this.emit('error', new Error("Geolocation is not supported by this device"));

    else if (Geolocation && isCapacitorAvailable())
      Geolocation.watchPosition(
        options ?? this.#options,
        (position, error) => {
          if (error)  this.emit('error', error);
          else        this.#handleNewPosition(position, precision ?? this.#precision);
        }
      )
      .then(watchId => this.#watchId = watchId);

    else
      this.#watchId = navigator.geolocation.watchPosition(
        position => this.#handleNewPosition(position, precision ?? this.#precision),
        error    => this.emit('error', error),
        options ?? this.#options
      );

    this.emit('startWatching', options ?? this.#options);

    return this;
  }

  stopWatching() {
    if (this.watching) {
      Geolocation ? Geolocation.clearWatch({ id: this.#watchId }) : navigator.geolocation.clearWatch(this.#watchId);
      this.#watchId = null;
      this.emit('stopWatching');
    }

    return this;
  }

  get [Symbol.toStringTag]() {
    return 'CurrentGpsPosition';
  }
}
