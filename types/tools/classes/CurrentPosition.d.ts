declare const CurrentPosition_base: new (...args: any[]) => GeoCoordinates & import("./EventEmitter").EventEmitterMethods;
export default class CurrentPosition extends CurrentPosition_base {
    constructor(watchNow?: boolean, ...args: any[]);
    destroy(): void;
    set watching(value: boolean);
    get watching(): boolean;
    startWatching(precision?: number, options?: {
        enableHighAccuracy: boolean;
        timeout: number;
        maximumAge: number;
    }): this;
    stopWatching(): this;
    #private;
}
import { GeoCoordinates } from "./";
export {};
