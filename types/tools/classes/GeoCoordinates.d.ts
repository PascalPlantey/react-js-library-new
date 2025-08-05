export default GeoCoordinates;
declare class GeoCoordinates {
    static fromObject(obj: any): GeoCoordinates;
    static fromString(str: any): GeoCoordinates;
    static isValid(obj: any): boolean;
    constructor(input: any);
    from(input: any): void;
    clone(): GeoCoordinates;
    set latitude(value: number);
    get latitude(): number;
    set longitude(value: number);
    get longitude(): number;
    set value(input: number[]);
    get value(): number[];
    isSameAs(other: any, precision?: number): boolean;
    /**
     * Calculates the distance in meters from the current GeoCoordinates instance to another set of coordinates
     * using the Haversine formula.
     *
     * @param {GeoCoordinates|{value: [number, number]}} other - The target coordinates,
     * either as a GeoCoordinates instance or an object with a `value` property containing [latitude, longitude].
     * @returns {number} The distance to the target coordinates in meters.
     */
    getDistanceTo(other: GeoCoordinates | {
        value: [number, number];
    }): number;
    /**
     * Calculates the bearing (angle) from this GeoCoordinates to another GeoCoordinates instance.
     * The bearing is the angle of the direction between the two points,
     * measured in degrees from the North (0°).
     * @param {GeoCoordinates} other - The target coordinates.
     * @returns {number} The bearing in degrees, normalized to the range [0, 360]
     */
    getBearingTo(other: GeoCoordinates): number;
    /**
     * Returns the cardinal direction (N, NE, E, SE, S, SW, W, NW) from this point to another
     * @param {GeoCoordinates} other
     * @returns {string} Direction
     */
    getDirectionTo(other: GeoCoordinates): string;
    toObject(): {
        latitude: number;
        longitude: number;
    };
    toString(): string;
    get [Symbol.toStringTag](): string;
    #private;
}
