import toIterable from '../misc/toIterable';

import ExtMap from './ExtMap';
import Compound from './Compound';

/**
 * Collect property values from a collection of objects (or an object) in a Set
 * @extends Set
 */
class PropertyValues extends Set {
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
  addValues(data, keyName, radical) {
    for(const item of toIterable(data))
      super.add(radical ? Compound.structure(radical, item[keyName]) : item[keyName]);

    return this;
  }

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
  addChildren(data, childrenItrKey, keyName, radicalKeyName) {
    for(const item of toIterable(data))
      this.add(item[childrenItrKey], keyName, radicalKeyName && `${item[radicalKeyName]}`);

    return this;
  }

  /**
   * Returns [s1, s2, ...] or [[k1, v1], ...] if build with compounds
   * @param {function} [fn] (a, b) => number (see [Mozilla]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort})
   * @returns {Array}
   */
  sortedArray(fn) {
    return [...this].sort(fn);
  }

  /**
   * For compounds only, builds a map { item1 => Set, item2 => Set, ... }
   * @returns {ExtMap}
   */
  toMap() {
    const map = new ExtMap();

    for(const [k, v] of this)
      map.getOrSet(k, new Set()).add(v);

    return map;
  }

  /**
   * Yields values or [k, v] if built with compounds (see `PropertyValues.addValues`)
   * @generator
   * @yields {any|Array<any>}
   * @example
   * for(const value of propValues)
   *   console.log(value);
   */
  *[Symbol.iterator]() {
    for(const value of this.values())
      yield Compound.isCompound(value) ? Compound.destructure(value) : value;
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'PropertyValues';
  }
}

export default PropertyValues;