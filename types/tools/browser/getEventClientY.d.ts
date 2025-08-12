export default getEventClientY;
/**
 * Extracts the vertical (clientY) coordinate from a mouse or touch event.
 *
 * Handles both mouse and touch events, including cases where the event is a touchend
 * and the coordinate must be taken from `changedTouches`.
 *
 * @param {MouseEvent | TouchEvent} e - The event object from a mouse or touch interaction.
 * @returns {number} The vertical coordinate (clientY) of the event, or 0 if not available.
 */
declare function getEventClientY(e: MouseEvent | TouchEvent): number;
