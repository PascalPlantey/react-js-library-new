export default Stats;
/**
 * Mean and standard deviation calculations. The class keep all the values added to the serie to be able
 * to calculate the standard deviation
 */
declare class Stats {
    /**
     * Adds a `rankFieldName` rank attribute using the given `fieldname` attribute. The array (data) is modified
     * @param {Array<any>} data Collection of objects to be ranked
     * @param {string} fieldName Name of the field to be ranked by (item[`fieldName`] should be a number)
     * @param {string} [rankFieldName='rank'] Name of the ranking attribute added to the items of `data` (default 'rank')
     * @returns {Array<any>} data sorted by `fieldName`, with a new property named `rankFieldName`
     * @maintenance
     * + 28/01/2024: ranking does not increase when two elements have the same value
     */
    static rankBy(data: Array<any>, fieldName: string, rankFieldName?: string): Array<any>;
    /**
     * @param {Iterable} [itr=Array] Iterable used to get values
     * @param {function} [callBack] If provided, used to gather values from itr callBack: (item) => number
     */
    constructor(itr?: Iterable<any>, callBack?: Function);
    /**
     * Add a single or many values to the Stats
     * @param {Iterable<any>} [itr=Array] Value(s) to be added to the Stats
     * @param {function} [callback] Function to extract the values from itr items
     * @returns {this}
     * @example
     *   const data = [{ count: 1 }, { count: 3 }, ...];
     *   const cmpx = [{ x: [{  count: 2 }, { count: 5 }, ...]}, { x: [{ count: 4 }, { count: 3 }, ...]}, ...]
     *   const vals = [5, 8, 3, ...]
     *   new Stats(data, callback) // callback extracts the count values from data one by one 1, 3, ...
     *   new Stats(cpmx, callback) // callback extracts the count values as arrays (ie) [2, 5], [4, 3], ...
     *   new Stats(vals)           // many values from an Iterable
     *   new Stats(5)              // single value
     */
    add(itr?: Iterable<any>, callback?: Function): this;
    /**
     * Clears the serie
     * @returns {this}
     */
    reset(): this;
    /**
     * Mean of the serie
     * @type {number}
     */
    get mean(): number;
    /**
     * Standard deviation for the serie
     * @type {number}
     */
    get stddev(): number;
    /**
     * Variation coefficient
     * @type {number}
     */
    get variation(): number;
    /**
     * Gives the sum of the serie values
     * @type {number}
     */
    get sum(): number;
    /**
     * Gives the size (number of values) of the serie
     * @type {number}
     */
    get size(): number;
    /**
     * Growth of the serie, from first to last values added
     * @type {Number}
     */
    get growth(): number;
    /**
     * Using all the values in the serie returns a `new Stats` object giving statistics of the growth from each value
     * to the next
     * @type {Stats}
     */
    get growthStats(): Stats;
    /**
     * Changed the default object type name visible through Object.prototype.toString.call
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
