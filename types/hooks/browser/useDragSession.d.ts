export default useDragSession;
/**
 * Custom React hook to manage drag sessions on a given element.
 * Attaches pointer and drag event listeners to the target element and
 * invokes provided callbacks for drag start, move, and end events.
 *
 * @param {HTMLElement|React.RefObject|function} elt - The target element, ref, or function returning the element to attach drag listeners to.
 * @param {function} [onStart=noop] - Callback invoked when drag starts. Receives an object: { from : { x, y }, elt }.
 * @param {function} [onMove=noop] - Callback invoked when drag moves. Receives an object: { from : { x, y }, to : { x, y }, elt }.
 * @param {function} [onEnd=noop] - Callback invoked when drag ends. Receives an object: { from : { x, y }, to : { x, y }, elt }.
 *
 * @returns {void}
 */
declare function useDragSession(elt: HTMLElement | import("react").RefObject<any> | Function, exclude: any, onStart?: Function, onMove?: Function, onEnd?: Function): void;
