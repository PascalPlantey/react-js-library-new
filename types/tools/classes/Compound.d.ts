export default Compound;
/**
 * Building/Destructuring compound keys. Useful when building a Set or Map with unique keys
 * @example
 * const compound = Compound.structure('Service cloud', 'Field Service Consultant'); // 'Service Cloud|Field Service Consultant'
 * let cloud, certification;
 * if (Compound.isCompound(compound))
 *   [cloud, certification] = Compound.destructure(compound);                        // ['Service Cloud', 'Field Service Consultant']
 */
declare class Compound {
    static "__#private@#regexp": RegExp;
    /**
     * @static
     * @description Is value a compound string?
     * @function isCompound
     * @param {any} value Value to be tested
     * @returns {boolean}
     * @memberof Compound
     */
    static isCompound: (value: any) => boolean;
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
    static structure: (...args: any[][]) => string;
    /**
     * @static
     * @description If value is a Compound string, destructure and return values
     * @function destructure
     * @param {any|string} value Value is supposed to be a compound value
     * @returns {Array<string>|Array<any>} Array with the compound values, or value itself in an array ([value]) if it is not a compound
     * @memberof Compound
     */
    static destructure: (value: any | string) => Array<string> | Array<any>;
    /**
     * Change the default object type name visible through Object.prototype.toString.call
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
}
