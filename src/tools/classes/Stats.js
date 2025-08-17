import { ExtArray, ExtMath } from "./";
import { isIterable } from "../is";

/**
 * Mean and standard deviation calculations. The class keep all the values added to the serie to be able
 * to calculate the standard deviation
 */
class Stats {
  #serie = new ExtArray();
  #sum = 0;

  /**
   * Adds a `rankFieldName` rank attribute using the given `fieldname` attribute. The array (data) is modified
   * @param {Array<any>} data Collection of objects to be ranked
   * @param {string} fieldName Name of the field to be ranked by (item[`fieldName`] should be a number)
   * @param {string} [rankFieldName='rank'] Name of the ranking attribute added to the items of `data` (default 'rank')
   * @returns {Array<any>} data sorted by `fieldName`, with a new property named `rankFieldName`
   * @maintenance
   * + 28/01/2024: ranking does not increase when two elements have the same value
   */
  static rankBy(data, fieldName, rankFieldName = 'rank') {
    let previous = [undefined, undefined];

    data
    .sort((item1, item2) => item2[fieldName] - item1[fieldName])
    .forEach((item, index) => {
      const [previousRank, previousValue] = previous;

      if (previousValue === item[fieldName])    // Same value, item gets the same rank than previous one
        item[rankFieldName] = previousRank;
      else                                      // Set item rank and keep new values (previous ranking and value)
        previous = [item[rankFieldName] = index + 1, item[fieldName]];
    });

    return data;
  }

  /**
   * @param {Iterable} [itr=Array] Iterable used to get values
   * @param {function} [callBack] If provided, used to gather values from itr callBack: (item) => number
   */
  constructor(itr = [], callBack) {
    this.add(itr, callBack);
  }

  /**
   * Adds a single value
   * @param {number} value Value to be added
   * @returns {this}
   */
  #addValue(value) {
    this.#serie.push(value);
    this.#sum += value;
    return this;
  }

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
  add(itr = [], callback) {
    if (isIterable(itr)) {                                          // Adding a serie
      if (callback)                                                 // If a callback is provided,
        for(const item of itr)
          this.add(callback(item));                                 // let the callback extract the values
      else                                                          // No callback, should be a serie of values
        for(const item of itr)                                      // to be added to the stats
          this.#addValue(item);
    }
    else
      this.#addValue(itr);                                          // Single value to be added

    return this;
  }

  /**
   * Clears the serie
   * @returns {this}
   */
  reset() {
    this.#serie = new ExtArray();
    this.#sum = 0;
    return this;
  }

  /**
   * Mean of the serie
   * @type {number}
   */
  get mean() {
    return this.size ? this.sum / this.size : 0;
  }

  /**
   * Standard deviation for the serie
   * @type {number}
   */
  get stddev() {
    if (!this.size) return 0;

    const mean = this.mean;
    return Math.sqrt(this.#serie.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / this.size);
  }

  /**
   * Variation coefficient
   * @type {number}
   */
  get variation() {
    if (!this.size) return 0;
    return this.stddev / this.mean;
  }

  /**
   * Gives the sum of the serie values
   * @type {number}
   */
  get sum() { return this.#sum; }

  /**
   * Gives the size (number of values) of the serie
   * @type {number}
   */
  get size() { return this.#serie.length; }

  /**
   * Growth of the serie, from first to last values added
   * @type {Number}
   */
  get growth() {
    return ExtMath.growth(this.#serie.first, this.#serie.last);
  }

  /**
   * Using all the values in the serie returns a `new Stats` object giving statistics of the growth from each value
   * to the next
   * @type {Stats}
   */
  get growthStats() {
    const growthStats = new Stats();

    for(let i = 1; i < this.#serie.length; ++i)
      growthStats.add(ExtMath.growth(this.#serie[i - 1], this.#serie[i]));

    return growthStats;
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'Stats';
  }
}

export default Stats;