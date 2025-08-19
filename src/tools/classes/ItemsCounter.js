import isArray from '../is/isArray';
import isFunction from '../is/isFunction';
import isString from '../is/isString';

import toIterable from '../misc/toIterable';

import ExtString from './ExtString';

const defaultRadical = 'Others: ';

/**
 * Counts the occurences items found in an iterable Object
 * @extends Map
 */
class ItemsCounter extends Map {
  /**
   * Builds an `ItemsCounter` in many different ways (see `ItemsCounter.AddCounts` examples)
   * @param {Iterable|object} [itr=[]] Object or Collection of objects or undefined (defaults to [])
   * @param {function} [callback] Function returning key/value pairs to be added [[k, v], [k, v]]
   */
  constructor(itr = [], callback) {
    super();
    this.addCounts(itr, callback);
  }

  /**
   * Add counts to an `ItemsCounter` in different ways. `itr` can be a Map with pairs of key/number,
   * thus can copy an `ItemsCounter`, allowing the constructor to copy/construct an `ItemsCounter`
   * @param {Iterable} [itr=[]] Object or Collection of objects or undefined (defaults to [])
   * @param {function} [callback] Function returning key/count pairs to be added [[k, c], [k, c]] or [k1, k2, ...]
   * @returns {this}
   * @example
   * new ItemsCounter("abcdedfde")                                // => Counts letters
   * new ItemsCounter(['blue', 'blue', 'red'])                    // => Counts occurences of colors
   * new ItemsCounter([['a', 2], ['a', 5], ['b', 3]])             // => Counts of 'a' and 'b'
   * new ItemsCounter([{ name: 'a', count: 5 }, { name: 'a', count: 2 }], ({ name, count }) => [[name, count]]) // => Occurences in objects
   */
  addCounts(itr = [], callback) {
    for(const item of toIterable(itr))
      if (isFunction(callback))                                             // Provided callback returning array [[key, value], ...]
        this.addCounts(callback(item));
      else                                                                  // Considers `itr` is an iterator over keys or [key, value]
        this.addCount(item);

    return this;
  }

  /**
   * Adds a `count` of occurences of an item in the counter. `item` has to be an array [k, c] and `count` `undefined` or a key
   * which will be counted `count` times
   * @param {any|Array<any, number>} item Item to be added
   * @param {number} [count=1] Occurences to add (defaults to 1)
   * @returns {this}
   * @maintenance
   * + 09/02/2024: simplified so that `item` is either an array [key, count] or a key (not a multi [[k, c], ...])
   */
  addCount(item, count) {
    if      (isArray(item) && item.length === 2 && !count)                  // Case where item = [key, count] only
      this.addCount(item[0], item[1]);
    else
      this.set(item, (this.get(item) ?? 0) + (count === undefined ? 1 : count));

    return this;
  }

  /**
   * Returns an array of the key/counts of the ItemsObject
   * @returns {Array<Array>} The entries as an array in the form [[k, c], [k, c], ...]
   */
  toArray() { return [...this.entries()]; }

  /**
   * Sum of the counts in the ItemsCounter
   * @type {number}
   */
  get totalCount() {
    let acc = 0;
    for(const c of this.values())
      acc += c;
    return acc;
  }

  /**
   * @generator
   * @description An iterator over the percentages of occurences of each item. Each element
   * iterated is in the form [key, count, percentage]
   * @param {number} [digits=2] Number of digits for the percentage results
   * @yields {array<any, number, number>} [key, count, percentage]
   */
  *percentages(digits = 2) {
    const total = this.totalCount;

    for(const [k, c] of this.entries())
      yield [k, c, parseFloat((c / total * 100).toFixed(digits))];
  }

  /**
   * @generator
   * @description An iterator transforming each key/count in the form { keyName: k, countName: c }
   * @param {string} [keyName='key'] Name to be used for the key property in the returned object
   * @param {string} [countName='count'] Name to be used for the count property in the returned object
   * @param {boolean} [withPercent=false] Include the percentage of occurences?
   * @param {string} [percentName='percentage'] Name to be used for the percentage property in the returned object
   * @param {number} [digits=2] Number of digits for the percentages
   * @yields {object} { keyName: k, countName: c } or { keyName: k, countName: c, percentName: p }
   */
  *objects(keyName = 'key', countName = 'count', withPercent = false, percentName = 'percentage', digits = 2) {
    if (withPercent)
      for(const [k, c, p] of this.percentages(digits))
        yield { [keyName]: k, [countName]: c, [percentName]: p };
    else
      for(const [k, c] of this.entries())
        yield { [keyName]: k, [countName]: c };
  }

  /**
   * Returns an array from the ItemsCounter
   * @param {string} [keyName='key'] Name to be used for the key property in the returned object
   * @param {string} [countName='count'] Name to be used for the count property in the returned object
   * @param {boolean} [withPercent=false] Include the percentage of occurences?
   * @param {string} [percentName='percentage'] Name to be used for the percentage property in the returned object
   * @param {number} [digits=2] Number of digits for the percentages
   * @returns {Array} [{ keyName: k, countName: c }, ...] or [{ keyName: k, countName: c, percentName: p }, ...]
   */
  toObjectsArray(keyName = 'key', countName = 'count', withPercent = false, percentName = 'percentage', digits = 2) {
    return [...this.objects(keyName, countName, withPercent, percentName, digits)];
  }

  /**
   * Modifies the ItemsCounter, sorting the items with the sort function provided
   * @param {function} func Sort function to be used ([k, c], [k, c]) => number (see [Mozilla]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort})
   * @returns {this}
   */
  sort(func) {
    const asArray = this.toArray().sort(func);                                // Get as sorted array
    this.clear();                                                             // Empties current ItemCounters

    for(const [k, c] of asArray)                                              // Pushes items back the ItemCounter (sorted)
      this.addCount(k, c);

    return this;
  }

  /**
   * Sorts the ItemsCounter object ascending or descending
   * @param {boolean} [ascending=false] Sort order
   * @returns {this}
   */
  sortByCount(ascending = false) { return this.sort(([, c1], [, c2]) => ascending ? c1 - c2 : c2 - c1); }

  /**
   * Group the items which percentages are under the number provided (the ItemsCounter is modified)
   * @param {number} [number=5] Percentage under (<=) which the item is removed and grouped
   * @param {string} [sep='; '] Separator to be used when concatenating the keys for the new item containing grouped values
   * @param {string} [radical='Others: '] Radical key
   * @returns {this}
   */
  groupLowerThan(number = 5, sep = '; ', radical = defaultRadical) {
    const toBegrouped = [];

    for(const [k, c, p] of this.percentages())                                // List items to be grouped
      if (p <= number)
        toBegrouped.push([k, c]);

    if (toBegrouped.length > 1) {                                             // Don't group if only one item (or zero...)
      let groupKey = '',                                                      // New key for the items below the percentage
          groupCount = 0;

      for(const [k, c] of toBegrouped) {                                      // Delete grouped keys and build new key
        groupKey = ExtString.extend(groupKey, `${k}: ${c}`, sep, radical);
        groupCount += c;
        this.delete(k);
      }

      this.addCount(groupKey, groupCount);                                    // Add the grouped key with its figure
    }

    return this;
  }

  /**
   * Is label the name of a grouped label
   * @param {string} label Text to be tested
   * @param {string} [radical='Others: '] Radical used to build the grouped name
   * @returns {boolean}
   */
  // @ts-ignore
  #isGroupedLabel(label, radical = defaultRadical) {
    return isString(label) && label.startsWith(radical);
  }

  /**
   * Finds the grouped label if any
   * @param {string} [radical='Others: '] Radical used to build the grouped name
   * @returns {string|undefined} The grouped label
   */
  groupedLabel(radical = defaultRadical) {
    for(const label of this.keys())
      if (this.#isGroupedLabel(label, radical))
        return label;
  }

  /**
   * Returns true if this has a grouped label
   * @param {string} [radical='Others: ' Radical used to build the grouped name
   * @returns {boolean}
   */
  hasGroupedLabel(radical = defaultRadical) {
    return this.groupedLabel(radical) !== undefined;
  }

  /**
   * Returns the key/value pairs of the grouped label or empty array if there is no grouped label
   * @param {string} [radical='Others: '] Radical used to build the grouped name
   * @returns {Array} [[label, count], [label, count], ...]
   */
  unstructuredGroup(radical = defaultRadical) {
    const items = [];
    const str = this.groupedLabel(radical);

    if (str)
      for(const { groups : { label, value }} of str.matchAll(/(Others: )?((?<label>.+?):\s(?<value>\d+);?\s?)+?/g))
        items.push([label, parseInt(value)]);

    return items;
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'ItemsCounters';
  }
}

export default ItemsCounter;