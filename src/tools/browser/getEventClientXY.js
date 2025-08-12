import getEventClientX from "./getEventClientX";
import getEventClientY from "./getEventClientY";

/**
 * Extracts the client X and Y coordinates from a given event.
 *
 * @param {Event} e - The event object from which to extract coordinates.
 * @returns {{x: number, y: number}} An object containing the client X and Y coordinates.
 */
const getEventClientXY = e => ({
  x: getEventClientX(e),
  y: getEventClientY(e)
});

export default getEventClientXY;