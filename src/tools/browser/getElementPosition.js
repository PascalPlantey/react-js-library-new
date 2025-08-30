import getHTMLElement from "./getHTMLElement";

/**
 * Retrieve the position and size of a DOM element
 * @param {DOMElement} el
 * @returns {object} { top, left, bottom, right, height, width } Properties are undefined if el is not set
 */
const getElementPosition = el => {
  let elt = getHTMLElement(el);
  if (!elt) return { top: undefined, left: undefined, bottom: undefined, right: undefined, height: undefined, width: undefined };

  let left, top,
      height = elt?.clientHeight,
      width = elt?.clientWidth;

  for(left = top = 0; elt && !isNaN(elt.offsetLeft) && !isNaN(elt.offsetTop); elt = elt.offsetParent) {
    left += elt.offsetLeft - elt.scrollLeft;
    top += elt.offsetTop - elt.scrollTop;
  }

  return { top, left, height, width, bottom: top ? top + height : undefined, right: left ? left + width : undefined };
};

export default getElementPosition;