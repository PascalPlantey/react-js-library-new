/**
 * Determines if the current device supports touch events.
 *
 * @function
 * @returns {boolean} True if the device supports touch input, otherwise false.
 */
const isTouchDevice = () =>
  ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0);

export default isTouchDevice;