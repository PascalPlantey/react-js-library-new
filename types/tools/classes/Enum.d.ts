export default Enum;
/**
 * Create a pseudo enumeration
 * @param {string} name Name of enumeration
 * @param {object|Array} values Enumeration values (see examples)
 * @returns {object}
 * @example
 * const Directions = createEnum('Directions', ['up', 'down']);
 * console.log(Directions) // { up: 'up', down: 'down' }
 * @example
 * const KeyboardDirections = createEnum('Keyboard directions', [
 *   { key: 'up', value: 56 },
 *   ['down', 84],
 *   ['left', 55],
 *   ['right', 57]
 * ]);
 * switch(key) {
 *   case(KeyboardDirections.up)
 *     // code
 *     break;
 *   ...
 * }
 */
/**
 * @class
 * @name Enum
 * @constructs
 * @description Create a pseudo enumeration. The following values cannot be used as key name:
 * ['get', 'has', 'keys', 'name', 'protected', 'toString' , 'values']
 * @param {string} name Name of enumeration
 * @param {object|Array} values Enumeration values (see examples)
 * @returns {object}
 * @example
 * const directions = createEnum('Directions', ['up', 'down']);
 * console.log(directions.up);                  // 'up'
 * for(const [key, value] of directions)
 *   console.log(key, value);                   // 'up', 'up' / 'down', 'down' }
 * @example
 * const keyboardDirections = createEnum('Keyboard directions', [
 *   { key: 'up', value: 56 },
 *   ['down', 84],
 *   ['left', 55],
 *   ['right', 57]
 * ]);
 * switch(key) {
 *   case(keyboardDirections.up)
 *     // code
 *     break;
 *   ...
 * }
 */
declare function Enum(name: string, values: object | any[]): object;
declare class Enum {
    /**
     * Create a pseudo enumeration
     * @param {string} name Name of enumeration
     * @param {object|Array} values Enumeration values (see examples)
     * @returns {object}
     * @example
     * const Directions = createEnum('Directions', ['up', 'down']);
     * console.log(Directions) // { up: 'up', down: 'down' }
     * @example
     * const KeyboardDirections = createEnum('Keyboard directions', [
     *   { key: 'up', value: 56 },
     *   ['down', 84],
     *   ['left', 55],
     *   ['right', 57]
     * ]);
     * switch(key) {
     *   case(KeyboardDirections.up)
     *     // code
     *     break;
     *   ...
     * }
     */
    /**
     * @class
     * @name Enum
     * @constructs
     * @description Create a pseudo enumeration. The following values cannot be used as key name:
     * ['get', 'has', 'keys', 'name', 'protected', 'toString' , 'values']
     * @param {string} name Name of enumeration
     * @param {object|Array} values Enumeration values (see examples)
     * @returns {object}
     * @example
     * const directions = createEnum('Directions', ['up', 'down']);
     * console.log(directions.up);                  // 'up'
     * for(const [key, value] of directions)
     *   console.log(key, value);                   // 'up', 'up' / 'down', 'down' }
     * @example
     * const keyboardDirections = createEnum('Keyboard directions', [
     *   { key: 'up', value: 56 },
     *   ['down', 84],
     *   ['left', 55],
     *   ['right', 57]
     * ]);
     * switch(key) {
     *   case(keyboardDirections.up)
     *     // code
     *     break;
     *   ...
     * }
     */
    constructor(name: string, values: object | any[]);
}
