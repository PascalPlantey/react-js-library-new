import { useRef } from "react";

import useEventListener from "./useEventListener";
import { useLast, useOnMount } from "../react";

import { getEventTarget, getEventClientXY } from "../../tools/browser";
import { noop, toIterable  } from "../../tools/misc";
import { isString } from "../../tools/is";


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
const useDragSession = (elt, exclude, onStart = noop, onMove = noop, onEnd = noop) => {
  const isDraggingRef = useRef(false);
  const refElt = useRef(getEventTarget(elt));
  const excludeListRef = useLast(exclude
                                  ? isString(exclude) 
                                    ? [exclude]
                                    : toIterable(exclude)
                                  : []),
        onStartFnRef = useLast(onStart),
        onMoveFnRef = useLast(onMove),
        onEndFnRef = useLast(onEnd);
  const startFromRef = useRef({});                          // During a drag session holds the initial position

  const { toggle : togglePointerUp }    = useEventListener("pointerup", handleDragEnd, refElt, false);
  const { toggle : togglePointerMove }  = useEventListener("pointermove", handleDragMove, refElt, false);
  const { toggle : togglePointerDown }  = useEventListener("pointerdown", handleDragStart, refElt, false);

  useOnMount(() => {
    if (refElt.current === undefined) {
      refElt.current = getEventTarget(elt);

      if (refElt.current !== undefined)                     // We can start listening to drag start events
        togglePointerDown();
      else
        console.warn("useDragSession: the target element is not defined or not found :", elt);
    }
  });

  const toggleListeners = () => {
    togglePointerMove();
    togglePointerUp();
  }

  const paramValue = event => {
    let delta;
    const to = getEventClientXY(event);
    if (to)
      delta = {
        x: to.x - startFromRef.current.x,
        y: to.y - startFromRef.current.y
      };

    return { event, from: startFromRef.current, to, delta, elt: refElt.current };
  };

  function handleDragStart(event) {
    const shouldStart = !excludeListRef.current.some(sel => event.target.closest(sel));

    if (!shouldStart || isDraggingRef.current) return;
    event.stopPropagation();

    isDraggingRef.current = true;
    startFromRef.current = getEventClientXY(event);
    toggleListeners();                                      // Start listening to drag events move & up
    onStartFnRef.current(paramValue(event));
  }

  function handleDragMove(event) {
    if (!isDraggingRef.current) return;
    event.stopPropagation();

    onMoveFnRef.current(paramValue(event));
  }

  function handleDragEnd(event) {
    if (!isDraggingRef.current) return;
    event.stopPropagation();

    isDraggingRef.current = false;
    toggleListeners();
    onEndFnRef.current(paramValue(event));
  }
};

export default useDragSession;
