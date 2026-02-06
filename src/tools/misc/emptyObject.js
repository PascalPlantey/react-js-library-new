/**
 * An empty object constant used as a default or sentinel value.
 * Useful for avoiding object literals in comparisons or as default parametersin React components
 * @type {Object}
 * @readonly
 */
export const emptyObject = {};

/**
 * An empty object constant used as a default or sentinel value.
 * Useful for avoiding object literals in comparisons or as default parametersin React components
 * @type {Object}
 * @readonly
 */
export const frozenObject = Object.freeze(emptyObject);

/**
 * A sealed empty object that prevents adding or removing properties.
 * @type {Object}
 * @const
 */
export const sealedObject = Object.seal(emptyObject);

/**
 * An empty array constant used as a reusable reference for empty array values.
 * @type {Array}
 * @const
 */
export const emptyArray = [];

/**
 * A frozen empty array that cannot be modified.
 * @type {Object}
 * @constant
 */
export const frozenArray = Object.freeze(emptyArray);

/**
 * A sealed empty array that cannot be modified, extended, or reconfigured.
 * @type {Object}
 * @constant
 */
export const sealedArray = Object.seal(emptyArray);