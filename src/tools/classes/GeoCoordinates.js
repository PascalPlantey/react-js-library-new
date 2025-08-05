import { isNumber } from "../is";

class GeoCoordinates {
  #latitude = 0;
  #longitude = 0;

  constructor(input) {
    this.from(input);
  }

  from(input) {
    if (input instanceof GeoCoordinates) {
      this.#latitude = input.latitude;
      this.#longitude = input.longitude;
    } else if (Array.isArray(input)) {
      this.#latitude = Number(input[0]);
      this.#longitude = Number(input[1]);
    } else if (typeof input === 'object' && input !== null && 'latitude' in input && 'longitude' in input) {
      this.#latitude = Number(input.latitude);
      this.#longitude = Number(input.longitude);
    } else {
      throw new Error('Invalid input for GeoCoordinates');
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
  }

  get longitude() {
    return this.#longitude;
  }
  set longitude(value) {
    if (!isNumber(value))
      throw new TypeError('Longitude must be a number');

    this.#longitude = Number(value);
  }

  get value() {
    return [this.#latitude, this.#longitude];
  }

  set value(input) {
    this.from(input);
  }

  isSameAs(other, precision = 0) {
    return this.getDistanceTo(other) <= precision;
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
    return { latitude: this.#latitude, longitude: this.#longitude };
  }

  toString() {
    return `${this.#latitude},${this.#longitude}`;
  }

  get [Symbol.toStringTag]() {
    return 'GeoCoordinates';
  }
}

export default GeoCoordinates;