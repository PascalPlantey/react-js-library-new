/**
 * Extracts the horizontal (clientX) coordinate from a mouse or touch event.
 *
 * Handles both mouse and touch events, including cases where the event is a touchend
 * and the coordinate must be taken from `changedTouches`.
 *
 * @param {MouseEvent | TouchEvent} e - The event object from a mouse or touch interaction.
 * @returns {number} The horizontal coordinate (clientX) of the event, or 0 if not available.
 */
const getEventClientX = e => {
  // touchstart/touchmove events have touches
  if (e.touches && e.touches.length)                    return e.touches[0].clientX;
  // mouse events
  else if (typeof e.clientX === "number")               return e.clientX;
  // touchend
  else if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
  // Fallback if no clientX is available
  else                                                  return 0;
};

export default getEventClientX;