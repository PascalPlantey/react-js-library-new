export default getEventClientX;
/**
 * Extracts the horizontal (clientX) coordinate from a mouse or touch event.
 *
 * Handles both mouse and touch events, including cases where the event is a touchend
 * and the coordinate must be taken from `changedTouches`.
 *
 * @param {MouseEvent | TouchEvent} e - The event object from a mouse or touch interaction.
 * @returns {number} The horizontal coordinate (clientX) of the event, or 0 if not available.
 */
declare function getEventClientX(e: MouseEvent | TouchEvent): number;
