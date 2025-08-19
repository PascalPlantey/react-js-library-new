import isIterable from '../is/isIterable.js';
import isString from '../is/isString.js';

import ExtString from './ExtString.js';

/**
 * Building/Destructuring compound keys. Useful when building a Set or Map with unique keys
 * @example
 * const compound = Compound.structure('Service cloud', 'Field Service Consultant'); // 'Service Cloud|Field Service Consultant'
 * let cloud, certification;
 * if (Compound.isCompound(compound))
 *   [cloud, certification] = Compound.destructure(compound);                        // ['Service Cloud', 'Field Service Consultant']
 */
class Compound {
  static #regexp = /\s*(?<!\\)\|(?!\s)/;

  /**
   * @static
   * @description Is value a compound string?
   * @function isCompound
   * @param {any} value Value to be tested
   * @returns {boolean}
   * @memberof Compound
   */
  static isCompound = value => isString(value) && this.#regexp.test(value);

  /**
   * @static
   * @description Build a compound string individual values. To include the '|' in an indivudual value use '\\|': 'String\\| 1'
   * @function structure
   * @param {...any[]} args Arguments
   * @returns {string} `${arg1}|${arg2}|${arg3}...`
   * @memberof Compound
   * @example
   * Compound.structure('String 1');                 // => 'String 1'
   * Compound.structure(1);                          // => '1'
   * Compound.structure('s 1', 's2 ', 's4');         // => 's 1|s2|s4'
   * Compound.structure(['s 1', 's2 ', 's4']);       // => 's 1|s2|s4'
   */
  static structure = (...args) => {
    let compound = '', theArgs = args;

    // If there is only one argument, a string or a non iterable value (like numeric), use this argument as the compound value
    // If there is only one argument, which is iterable, make coumpound from its individual values
    if (args.length === 1) {
      const arg = args[0];

      if ((isString(arg) || !isIterable(arg)) && arg !== undefined)
        return arg.toString().trim();                     // One argument only, not iterable, return as-is
      else
        theArgs = arg;                                    // One argument only, which is iterable
    }

    for(const arg of theArgs)                             // Add all elements to the result
      compound = ExtString.extend(compound, arg === undefined ? '' : arg.toString().trim(), '|');

    return compound;
  }

  /**
   * @static
   * @description If value is a Compound string, destructure and return values
   * @function destructure
   * @param {any|string} value Value is supposed to be a compound value
   * @returns {Array<string>|Array<any>} Array with the compound values, or value itself in an array ([value]) if it is not a compound
   * @memberof Compound
   */
  static destructure = value => Compound.isCompound(value) ? value.split(this.#regexp) : [value];

  /**
   * Change the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'Compound';
  }
}

export default Compound;