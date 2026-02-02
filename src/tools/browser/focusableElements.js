import getDocumentElement from "./getDocumentElement";

/**
 * Returns all focusable elements within a given container.
 *
 * Focusable elements include links, form controls, iframes, objects, embeds,
 * elements with a valid tabindex, and contenteditable elements, excluding those that are disabled.
 *
 * @param {Element|Document} [container=document] - The container within which to search for focusable elements.
 * @returns {Element[]} An array of focusable elements found within the container.
 */
export const getFocusableElements = (container = document) => {
  if (!container) return [];

  const focusableElements = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ].join(',');

  return Array.from(container.querySelectorAll(focusableElements));
};

/**
 * Attempts to focus the first focusable element within the given container.
 *
 * @param {HTMLElement} [container=document] - The DOM element that contains potential focusable elements.
 * @returns {boolean} Returns true if a focusable element was found and focused, otherwise false.
 */
export const focusFirstElement = container => {
  const focusableEls = getFocusableElements(container);

  if (focusableEls.length > 0) {
    setFocus(focusableEls[0]);
    return true;
  }

  return false;
};

/**
 * Focuses the last focusable element within the specified container.
 *
 * @param {HTMLElement} container - The container element to search for focusable elements.
 * @returns {boolean} Returns true if a focusable element was found and focused, otherwise false.
 */
export const focusLastElement = container => {
  const focusableEls = getFocusableElements(container);

  if (focusableEls.length > 0) {
    setFocus(focusableEls[focusableEls.length - 1]);
    return true;
  }

  return false;
};

/**
 * Moves focus to the next focusable element within a given container.
 * 
 * @param {HTMLElement} currentElement 
 * @param {HTMLElement|Document} [container=document] 
 * @returns {boolean} Returns true if focus was moved to the next element, false otherwise.
 */
export const focusNextElement = (currentElement, container) => {
  const focusableEls = getFocusableElements(container);
  const currentIndex = focusableEls.indexOf(currentElement);

  if (currentIndex !== -1 && currentIndex < focusableEls.length - 1) {
    setFocus(focusableEls[currentIndex + 1]);
    return true;
  }

  return false;
};

/**
 * Moves focus to the previous focusable element within a given container.
 *
 * @param {HTMLElement} currentElement - The currently focused element.
 * @param {HTMLElement|Document} [container=document] - The container in which to search for focusable elements.
 * @returns {boolean} Returns true if focus was moved to the previous element, false otherwise.
 */
export const focusPreviousElement = (currentElement, container) => {
  const focusableEls = getFocusableElements(container);
  const currentIndex = focusableEls.indexOf(currentElement);

  if (currentIndex > 0) {
    setFocus(focusableEls[currentIndex - 1]);
    return true;
  }

  return false;
};

/**
 * Determines if a given DOM element is focusable within its parent element.
 *
 * @param {HTMLElement} element - The DOM element to check for focusability.
 * @returns {boolean} True if the element is focusable, false otherwise.
 */
export const isElementFocusable = element => {
  if (!element) return false;

  return getFocusableElements(element.parentElement).includes(element);
};

// Returns true if the specified element currently has focus
export const hasFocus = element => document.activeElement === getDocumentElement(element);

// Sets focus to the specified element
export const setFocus = element => {
  const realElement = getDocumentElement(element);
  if (realElement && document.activeElement !== realElement)
    realElement.focus();
};