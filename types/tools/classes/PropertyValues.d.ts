export default PropertyValues;
/**
 * Collect property values from a collection of objects (or an object) in a Set
 * @extends Set
 */
declare class PropertyValues extends Set<any> {
    constructor(values?: readonly any[]);
    constructor(iterable?: Iterable<any>);
    /**
     * Adds property value(s) from one or many objects to the list
     * @param {object|Iterable<object>} data Collection of objects
     * @param {any} keyName Name of the property in the object(s)
     * @param {string} [radical] Prefix to be added to each value of the properties
     * @returns {this}
     * @example
     * v.addValues({ 'a': 'this is a value' }, 'a')                       // => 'this is a value'
     * v.addValues([{ a: 'x' }, { a: 'y' }, { a: 'x' }], 'a')             // => 'x', 'y'
     * v.addValues([{ a: 'x' }, { a: 'y' }, { a: 'x' }], 'a', 'r')        // => 'r|x', 'r|y'
     */
    addValues(data: object | Iterable<object>, keyName: any, radical?: string): this;
    /**
     * Adds property value(s) from the children collection of one or many objects to the list
     * @param {object|Iterable<any>} data Collection of objects
     * @param {string} childrenItrKey Key name of the children collection in the objects
     * @param {string} keyName Name of the property to be found in the objects
     * @param {string} [radicalKeyName] Prefix to be added to each value of the properties
     * @returns {this}
     * @example
     * const o = [{ id: '1', a: [{ b: 'q' }, { b: 's' }] }, { id: '2', a: [{ b: 'q' }, { b: 'd' }, { b: 'd' }] }];
     * v.addChildren(o, 'a', 'b')                                   // => 'q', 's', 'd'
     * v.addChildren(o, 'a', 'b', 'id')                             // => '1|q', '1|s', '2|q', '2|d'
     */
    addChildren(data: object | Iterable<any>, childrenItrKey: string, keyName: string, radicalKeyName?: string): this;
    /**
     * Returns [s1, s2, ...] or [[k1, v1], ...] if build with compounds
     * @param {function} [fn] (a, b) => number (see [Mozilla]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort})
     * @returns {Array}
     */
    sortedArray(fn?: Function): any[];
    /**
     * For compounds only, builds a map { item1 => Set, item2 => Set, ... }
     * @returns {ExtMap}
     */
    toMap(): ExtMap;
    /**
     * Yields values or [k, v] if built with compounds (see `PropertyValues.addValues`)
     * @generator
     * @yields {any|Array<any>}
     * @example
     * for(const value of propValues)
     *   console.log(value);
     */
    [Symbol.iterator](): Generator<any, void, unknown>;
}
import ExtMap from './ExtMap';
