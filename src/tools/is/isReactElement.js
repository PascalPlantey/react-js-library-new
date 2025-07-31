import React from "react";

/**
 * Check if a value is a React element
 * @param {any} elt Element to be tested
 * @returns {boolean}
 * @memberof JS_IsFunctions#
 */
const isReactElement = elt => React.isValidElement(elt);

export default isReactElement;