export default getEventClientXY;
/**
 * Extracts the client X and Y coordinates from a given event.
 *
 * @param {Event} e - The event object from which to extract coordinates.
 * @returns {{x: number, y: number}} An object containing the client X and Y coordinates.
 */
declare function getEventClientXY(e: Event): {
    x: number;
    y: number;
};
