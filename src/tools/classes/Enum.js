
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
function Enum(name, values) {
  // Generator returning [ k, v ], ...
  const enumObject = {
    [Symbol.iterator]: function* () {
      for(const k of Object.entries(enumObject))
        yield k;
    },
  };

  // Define getters 'keys', 'values', 'has'
  Object.defineProperties(enumObject, {
    reserved: {                                                     // For internal use (reserved keyword verification)
      value: ['get', 'has', 'keys', 'name', 'protected', 'toString' , 'values'],
    },
    keys: {                                                         // Array of enum keys
      get() {
        return Object.keys(enumObject);
      },
    },
    values: {                                                       // Array of enum values
      get() {
        return Object.values(enumObject);
      },
    },
    has: {                                                          // has('key'): boolean
      /** @param {any} name */
      value: name => enumObject.values.includes(name),
    },
    get: {                                                          // get('key'): any
      /** @param {any} search */
      value: (search) => {
        for(const [key, value] of Object.entries(enumObject))
          if (key === search)
            return value;
      },
    },
    name: {                                                         // Enumeration name
      value: name,
    },
    toString: {                                                     // String representation
      value: () => `${enumObject.name} - ${JSON.stringify(enumObject.keys)}`
    },
  });

  for (const val of values) {
    let key, value;                                                 // New (key;value) couple

    if (Array.isArray(val) && val.length === 2) {
      key = val[0];
      value = val[1];
    }
    else if (typeof val === 'object' && val.key && val.value) {
      key = val.key;
      value = val.value;
    }
    else
      key = value = val;

    if (enumObject.reserved.includes(key))
      throw new Error(`'${key}' is a reserved keyword`);

    enumObject[key] = value;
  }

  return Object.freeze(enumObject);
}

export default Enum;