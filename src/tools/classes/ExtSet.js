import resolve from "../misc/resolve";

export default class ExtSet extends Set {
  /**
   * Add one or many value to the Set. If value is a primitive type or non iterable object it is added as is, otherwise (Iterable)
   * all items are added to the Set
   * @param {Iterable|Function} value To be added to the Set
   * @param {Function} [fn] Function used to extract values from records
   * @returns {Set} this
   */
  addIterable(values, fn) {
    for(const value of values)
      super.add(resolve(fn, value));

    return this;
  }

  /**
   * Set entries as an array [v1, v2, ...]
   * @type {array}
   */
  get array() {
    return [...this];
  }

  /**
   * Returns ExtSet as a sorted array [v1, v2, ...]
   * @param {function} [sortFn=([a], [b]) => a.localeCompare(b)] Sort function, sorting by key by default
   * @return {array}
   */
  sortedArray(sortFn = ([a], [b]) => a.localeCompare(b)) {
    return this.array.sort(sortFn);
  }

  get [Symbol.toStringTag]() {
    return 'ExtSet';
  }
}