import isNumber from "../is/isNumber";

class GeoCoordinates {
  #latitude = 0;
  #longitude = 0;
  // Other data from GeolocationPosition
  #accuracy = null;
  #altitude = null;
  #altitudeAccuracy = null;
  #heading = null;
  #speed = null;
  #timestamp = null;

  constructor(...args) {
    this.from(...args);
  }

  // Clear extra properties (those coming from GeolocationPosition)
  #clearExtra() {
    this.#accuracy = null;
    this.#altitude = null;
    this.#altitudeAccuracy = null;
    this.#heading = null;
    this.#speed = null;
    this.#timestamp = null;
  }

  from(...args) {
    // from(lat, lon)
    if (args.length === 2 && args.every(isNumber)) {
      this.#latitude = Number(args[0]);
      this.#longitude = Number(args[1]);

    // from(any: <GeolocationPosition, GeoCoordinates | [number, number] | { latitude, longitude }>)
    } else if (args.length === 1) {
      const input = args[0];

      // Check if input is a GeoCoordinates instance
      if (input instanceof GeoCoordinates) {
        this.#latitude = input.latitude;
        this.#longitude = input.longitude;
        this.#accuracy = input.accuracy;
        this.#altitude = input.altitude;
        this.#altitudeAccuracy = input.altitudeAccuracy;
        this.#heading = input.heading;
        this.#speed = input.speed;
        this.#timestamp = input.timestamp;

      } else if (
        input instanceof GeolocationPosition ||
        // Capacitor Geolocation doesn't give a GeolocationPosition instance
        (input && typeof input.coords === 'object' && 'latitude' in input.coords && 'longitude' in input.coords)
      ) {
        this.#latitude = input.coords.latitude;
        this.#longitude = input.coords.longitude;
        this.#accuracy = input.coords.accuracy;
        this.#altitude = input.coords.altitude;
        this.#altitudeAccuracy = input.coords.altitudeAccuracy;
        this.#heading = input.coords.heading;
        this.#speed = input.coords.speed;
        this.#timestamp = input.timestamp;

      // Check if input is an array
      } else if (Array.isArray(input) && input.length >= 2) {
        this.#latitude = Number(input[0]);
        this.#longitude = Number(input[1]);
        this.#clearExtra();

      // Check if input is an object with latitude and longitude
      } else if (typeof input === 'object' && input !== null && 'latitude' in input && 'longitude' in input) {
        this.#latitude = Number(input.latitude);
        this.#longitude = Number(input.longitude);
        this.#clearExtra();

      } else
        throw new Error('Invalid input for GeoCoordinates:' + JSON.stringify(input));
    }
  }

  clone() {
    return new GeoCoordinates([this.#latitude, this.#longitude]);
  }

  static fromObject(obj) {
    return new GeoCoordinates([obj.latitude, obj.longitude]);
  }

  static fromString(str) {
    const [lat, lon] = str.split(',').map(Number);
    return new GeoCoordinates([lat, lon]);
  }

  static isValid(obj) {
    return (
      obj &&
      typeof obj.latitude === 'number' &&
      typeof obj.longitude === 'number' &&
      !isNaN(obj.latitude) &&
      !isNaN(obj.longitude)
    );
  }

  get latitude() {
    return this.#latitude;
  }
  set latitude(value) {
    if (!isNumber(value))
      throw new TypeError('Latitude must be a number');

    this.#latitude = Number(value);
    this.#clearExtra();
  }

  get longitude() {
    return this.#longitude;
  }
  set longitude(value) {
    if (!isNumber(value))
      throw new TypeError('Longitude must be a number');

    this.#longitude = Number(value);
    this.#clearExtra();
  }

  get accuracy() {
    return this.#accuracy;
  }

  get altitude() {
    return this.#altitude;
  }

  get altitudeAccuracy() {
    return this.#altitudeAccuracy;
  }

  get heading() {
    return this.#heading;
  }

  get speed() {
    return this.#speed;
  }

  get timestamp() {
    return this.#timestamp;
  }

  /**
   * Tools to access/manage the GeoCoordinates instance
   */
  get value() {
    return [this.#latitude, this.#longitude];
  }

  set value(input) {
    this.from(input);
  }

  isSameAs(other, precision = 0) {
    return this.getDistanceTo(other) <= precision;
  }

  isEqual(other) {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  /**
   * Calculates the distance in meters from the current GeoCoordinates instance to another set of coordinates
   * using the Haversine formula.
   *
   * @param {GeoCoordinates|{value: [number, number]}} other - The target coordinates,
   * either as a GeoCoordinates instance or an object with a `value` property containing [latitude, longitude].
   * @returns {number} The distance to the target coordinates in meters.
   */
  getDistanceTo(other) {
    const to = new GeoCoordinates(other);

    // Haversine formula
    const R = 6371000; // Earth radius in meters
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(to.latitude - this.#latitude);
    const dLon = toRad(to.longitude - this.#longitude);
    const lat1 = toRad(this.#latitude);
    const lat2 = toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Calculates the bearing (angle) from this GeoCoordinates to another GeoCoordinates instance.
   * The bearing is the angle of the direction between the two points,
   * measured in degrees from the North (0°).
   * @param {GeoCoordinates} other - The target coordinates.
   * @returns {number} The bearing in degrees, normalized to the range [0, 360]
   */
  getBearingTo(other) {
    const to = new GeoCoordinates(other);

    const toRadians = deg => (deg * Math.PI) / 180;
    const toDegrees = rad => (rad * 180) / Math.PI;

    const φ1 = toRadians(this.latitude);
    const φ2 = toRadians(to.latitude);
    const Δλ = toRadians(to.longitude - this.longitude);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (toDegrees(θ) + 360) % 360; // Convertir en degrés et normaliser entre 0 et 360
  }

  /**
   * Returns the cardinal direction (N, NE, E, SE, S, SW, W, NW) from this point to another
   * @param {GeoCoordinates} other
   * @returns {string} Direction
   */
  getDirectionTo(other) {
    const brng = this.getBearingTo(other);

    const directions = [
      "N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"
    ];
    const idx = Math.round(brng / 45);
    return directions[idx];
  }

  toObject() {
    return {
      latitude: this.#latitude,
      longitude: this.#longitude,
      accuracy: this.#accuracy,
      altitude: this.#altitude,
      altitudeAccuracy: this.#altitudeAccuracy,
      heading: this.#heading,
      speed: this.#speed,
      timestamp: this.#timestamp
    };
  }

  toString() {
    return `${this.#latitude},${this.#longitude}`;
  }

  get [Symbol.toStringTag]() {
    return 'GeoCoordinates';
  }
}

export default GeoCoordinates;