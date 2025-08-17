import { GeoCoordinates, EventEmitterMixin } from ".";

import { Geolocation } from '@capacitor/geolocation';

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

  constructor(watchNow = false, ...args) {
    super(...args);

    if (watchNow)
      this.startWatching();
  }

  destroy() {
    this.emit('destroy');
    this.stopWatching();
    this.offAll();
  }

  get watching() {
    return this.#watchId !== null;
  }

  set watching(value) {
    value ? this.startWatching() : this.stopWatching();
  }

  #handleNewPosition({ coords: { latitude, longitude } }, precision) {
    const newPosition = [latitude, longitude];
    if (this.getDistanceTo(newPosition) > precision) {
      this.from(newPosition);
      this.emit('positionchange', { latitude, longitude });
    }
  }

  startWatching(precision = 0, options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }) {
    if (this.watching)
      ;

    else if (!Geolocation && !navigator.geolocation)
      this.emit('error', new Error("Geolocation is not supported by this device"));

    else if (Geolocation)
      Geolocation.watchPosition(
        options,
        (position, error) => {
          if (error)  this.emit('error', error);
          else        this.#handleNewPosition(position, precision);
        }
      )
      .then(watchId => this.#watchId = watchId);

    else
      this.#watchId = navigator.geolocation.watchPosition(
        position => this.#handleNewPosition(position, precision),
        error => this.emit('error', error),
        options
      );

    this.emit('startWatching', options);

    return this;
  }

  stopWatching() {
    if (this.watching) {
      Geolocation ? Geolocation.clearWatch({ id: this.#watchId }) : navigator.geolocation.clearWatch(this.#watchId);
      this.emit('stopWatching');
    }

    return this;
  }

  get [Symbol.toStringTag]() {
    return 'CurrentGpsPosition';
  }
}
