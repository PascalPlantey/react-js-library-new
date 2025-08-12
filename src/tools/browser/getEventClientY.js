/**
 * Extracts the vertical (clientY) coordinate from a mouse or touch event.
 *
 * Handles both mouse and touch events, including cases where the event is a touchend
 * and the coordinate must be taken from `changedTouches`.
 *
 * @param {MouseEvent | TouchEvent} e - The event object from a mouse or touch interaction.
 * @returns {number} The vertical coordinate (clientY) of the event, or 0 if not available.
 */
const getEventClientY = e => {
  // touchstart/touchmove events have touches
  if (e.touches && e.touches.length)                    return e.touches[0].clientY;
  // mouse events
  else if (typeof e.clientY === "number")               return e.clientY;
  // touchend
  else if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientY;
  // Fallback if no clientY is available
  else                                                  return 0;
};

export default getEventClientY;