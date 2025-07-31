export default getHTMLElement;
/**
 * Tries to find a document element out of elt. Order of tests to get a value: if elt is ...
 * + a string, consider it is an element ID or querySelector
 * + a useRef object, it's input or the wrapped element
 * + in all other cases the elt itself
 * @param {React.MutableRefObject|string|Element} [elt] Element to be looked for; can be a string (tag ID or selector), or a ref (useRef), or an event target
 * @returns {Element|undefined} A document element, `undefined` if not found
 * @memberof JS_BrowserHelpers#
 */
declare function getHTMLElement(elt?: React.MutableRefObject<any> | string | Element): Element | undefined;
import React from "react";
