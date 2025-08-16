import ExtMap from "./ExtMap";
import ExtSet from "./ExtSet";
import resolve from "../misc/resolve";

/**
 * @extends ExtMap
 */
export default class MapOfSet extends ExtMap {
  /**
   * @constructor
   * @param {Iterable} iterable [[k, v], ...]
   * @param {function} [fn] If fn is provided fn receives every item if iterable and
   * returns array- fn: (item) => [key, value]
   */
  constructor(iterable, fn) {
    if (!fn) super(iterable);
    else {
      super();
      this.add(iterable, fn);
    }
  }

  /**
   * Gets the Set value associated with the key. If the key is not present adds it to the map with an empty Set
   * @param {any} key Key of the Map
   * @returns {ExtSet} The set associated with the key, empty or not
   */
  getOrSet(key) {
    return super.getOrSet(key, () => new ExtSet());
  }

  /**
   * Adds items to the map
   * @param {Iterable} iterable [[k, v], ...]
   * @param {function} [fn] If fn is provided fn receives every item of iterable and returns array- fn: (item) => [key, value]
   * @return {MapOfSet} this
   */
  add(iterable, fn) {
    for(const item of iterable ?? []) {
      const [key, value] = resolve(fn, item);
      this.getOrSet(key).add(value);
    }
    return this;
  }

  /**
   * Adds items to the map. The values in the items are iterable and all the values are added to the Set associated
   * with the key.
   * @param {Iterable} iterable [[k, v], ...]
   * @param {function} [mainFn] If provided receives every item if iterable and returns array- fn: (item) => [key, value]
   * @param {function} [childrenFn] If provided receives every child value and returns a value to be added to the Set. If 
   * not provided the values associated to the key are considered to be an array and every value of the array is added
   * to the Set
   * @return {MapOfSet} this
   */
  addWithChildren(iterable, mainFn, childrenFn) {
    for(const item of iterable) {
      const [key, values] = resolve(mainFn, item);

      if (childrenFn)
        for(const valueItem of values)
          this.getOrSet(key).add(resolve(childrenFn, valueItem));
      else
        this.getOrSet(key).addIterable(values);
    }

    return this;
  }

  /**
   * @returns {array} [[k, [v1, v2]], ...]
   */
  get array() {
    return super.array.map(([k, s]) => [k, [...s]]);
  }

  /**
   * @param {function} [keySortFn] Function to be used to sort the array by key
   * @param {function} [childSortFn] Function to be used to sort each values of a key
   * @returns {array} [[k, [v1, v2]], ...] sorted by key and value
   */
  getSortedArray(keySortFn = ([a], [b]) => a.localeCompare(b), childSortFn = ([a], [b]) => a.localeCompare(b)) {
    const sorted = this.array.sort(keySortFn);
    sorted.forEach(([, v]) => v.sort(childSortFn));
    return sorted;
  }

  /*
   * @returns {array} [[k, [v1, v2]], ...] sorted by key and value
   */
  get sortedArray() {
    return this.getSortedArray();
  }

  get [Symbol.toStringTag]() {
    return 'MapOfSet';
  }
}
