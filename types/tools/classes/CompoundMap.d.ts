export default class CompoundMap extends ExtMap {
    /**
     * @param {Iterable} [iterable] Items used to initialize the map
     * @param {Function} [fn] Function returning a [key, value] used to set an item in the Map. If not provided
     * each item of iterable is added to the Map; they should be in the form [[...keys], value]
     */
    constructor(iterable?: Iterable<any>, fn?: Function);
    /**
     * @param {Iterable} [iterable] Items used to initialize the map
     * @param {Function} [fn] Function returning a [key, value] used to set an item in the Map. If not provided
     * each item of iterable is added to the Map; they should be in the form [[...keys], value]
     */
    add(iterable?: Iterable<any>, fn?: Function): void;
    /**
     * Checks if an item is associated to the ...keys
     * @param {...any} keys
     * @returns {boolean}
     */
    has(...keys: any[]): boolean;
    /**
     * Return the value associated to the ...keys
     * @param  {...any} keys
     * @returns {any}
     */
    get(...keys: any[]): any;
    /**
     *
     * @param {Array} keys Keys of the item
     * @param {any} value New value to associate to the keys
     * @returns {CompoundMap} this
     */
    set(keys: any[], value: any): CompoundMap;
    /**
     * @param {Array} keys Keys of the item
     * @param {any} value New value to associate to the keys
     * @returns {any} Returns the value associated to the keys
     */
    getOrSet(keys: any[], value: any): any;
    /**
     * Deletes the items associated with the ...keys
     * @param  {Array} keys
     * @returns {boolean} True if an item has been removed from the Map
     */
    delete(...keys: any[]): boolean;
    /**
     * Change the default behavior of Map.forEach to send Compound keys to Map.forEach
     * @param {function} fn
     */
    forEach(fn: Function): void;
    /**
     * Generator for all the (keys / value) pairs of the map
     * @yields {Array<Array<>, any>} [[...keys], value]
     */
    entries(): Generator<any[], void, unknown>;
    /**
     * Generator for all the keys of the map
     * @yields {Array} [...keys]
     */
    keys(): Generator<any[] | string[], void, unknown>;
    /**
     * Generator for all the (keys / value) pairs of the map
     * @yields {Array<Array<>, any>} [[...keys], value]
     */
    [Symbol.iterator](): Generator<any[], void, unknown>;
}
import ExtMap from "./ExtMap";
