import getHTMLElement from "./getHTMLElement";
import isEventTarget from './isEventTarget'

/**
 * Tries to find a target element out of elt. Get a value from element (see below) and check if it
 * supports events or not. Order of tests to get a value: if elt is ...
 * + a string, consider it is an element ID or querySelector  
 * + a useRef object, the wrapped element  
 * + in all other cases the elt itself  
 * @param {React.MutableRefObject|string|Element} elt Element to be looked for; can be a string (tag ID or selector), or a ref (useRef), or an event target
 * @returns {Object|undefined} A target element with event listener support, `undefined` if not found
 * @memberof JS_BrowserHelpers#
 * @maintenance
 * + 11/01/2024: parameter defaults to document  
 */
const getEventTarget = (elt = document) => {
  const targetElt = getHTMLElement(elt) || elt;
  return isEventTarget(targetElt) ? targetElt : undefined;
};

export default getEventTarget;