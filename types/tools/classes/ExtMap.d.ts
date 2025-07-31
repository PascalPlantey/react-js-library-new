export default ExtMap;
/**
 * @description Extensions to JS.Map()
 * @extends Map
 */
declare class ExtMap extends Map<any, any> {
    /**
     * @param {Iterable} iterable Contains the items to be added
     * @param {Function} fn Extraction function
     */
    constructor(iterable: Iterable<any>, fn: Function);
    /**
     * Adds the items of iterable to the Map. fn returns an array with two values
     * @param {Iterable} iterable Contains the items to be added
     * @param {Function} fn Extraction function
     */
    add(iterable: Iterable<any>, fn: Function): void;
    /**
     * Adds the key/value in the map or retrieve the current value associated with the given key
     * @param {any} key Key to retrieve the element
     * @param {function|any} value Default value if the key is not found in the Map
     * @returns {any} value associated with the given key
     * @example
     * const addIndustry = (newIndustry, map) => {      // Standard Map
     *   let set = map.get('Industries');
     *   if (set === undefined) {
     *     set = new Set();
     *     map.set('Industries', set);
     *   }
     *   set.add(newIndustry);
     * }
     * @example
     * const addIndustry = (newIndustry, extmap) => {   // ExtMap
     *   extmap.getOrSet('Industries', () => new Set()).add(newIndustry);
     * }
     */
    getOrSet(key: any, value: Function | any): any;
    /**
     * Update a pair; the update function return the value to be saved with the key
     * @param {any} key Key for the Map
     * @param {function} update Function receiving current value for key which return value is saved with the key
     * @return {ExtMap} Current ExtMap object
     */
    setByFn(key: any, fn: any): ExtMap;
    /**
     * Update or insert a new pair; the update/insert functions return the value to be saved with the key
     * @param {any} key Key for the Map
     * @param {function} insert Function whith no parameters which return value is saved with the key
     * @param {function} update Function receiving current value for key which return value is saved with the key
     * @return {ExtMap} Current ExtMap object
     * @example
     * const map = new ExtMap();
     * const insert = () => 1;
     * const update = value => value + 1;
     * map.upsert('bananas', insert, update);           // 'bananas' => 1
     * map.upsert('bananas', insert, update);           // 'bananas' => 2
     */
    upsertByFn(key: any, insert: Function, update: Function): ExtMap;
    /**
     * Update all values of the Map with the result of the fn function
     * @param {function} fn
     * @returns {ExtMap} this
     */
    updateValues(fn: Function): ExtMap;
    /**
     * Map entries as an array [[key, value], ...]
     * @type {Array<Array>}
     */
    get array(): Array<any[]>;
    /**
     * Returns ExtMap as a sorted array [[k, v], [k, v], ...]
     * @param {function} [sortFn=([a], [b]) => a.localeCompare(b)] Sort function, sorting by key by default
     */
    sortedArray(sortFn?: Function): any[][];
    /**
     * Return a new ExtMap sorted
     * @param {function} [sortFn=([a], [b]) => a.localeCompare(b)] Sort function, sorting by key by default
     */
    sorted(sortFn?: Function): ExtMap;
    /**
     * Returns the map as an array of Objects
     * @param {string} [keyName='key'] Name to use for the key property
     * @param {string} [valueName='value'] Name to use for the value property
     * @param {function|null|undefined} [sortFn=([a], [b]) => a.localeCompare(b)] Sort function, sorting by key by default or no sort if null
     * @returns {Array} Array [{ `keyName`: k, `valueName`: v }, ...] sorted by `keyName`
     */
    objectsArray(keyName?: string, valueName?: string, sortFn?: Function | null | undefined): any[];
}
