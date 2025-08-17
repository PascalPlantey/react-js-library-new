export default useDragSession;
/**
 * Custom React hook to manage a drag session on a DOM element.
 * Handles pointer events to track drag start, move, and end, with optional exclusion selectors.
 *
 * @param {HTMLElement|string|React.RefObject} elt - The target element, selector, or ref to attach drag listeners to.
 * @param {string|string[]} [exclude] - Selector(s) to exclude from drag initiation (e.g., ".no-drag").
 * @param {function} [onStart=noop] - Callback invoked when drag starts. Receives an object: { event, from, to, delta, elt }.
 * @param {function} [onMove=noop] - Callback invoked when drag moves. Receives an object: { event, from, to, delta, elt }.
 * @param {function} [onEnd=noop] - Callback invoked when drag ends. Receives an object: { event, from, to, delta, elt }.
 *
 * @returns {void}
 */
declare function useDragSession(elt: HTMLElement | string | import("react").RefObject<any>, exclude?: string | string[], onStart?: Function, onMove?: Function, onEnd?: Function): void;
