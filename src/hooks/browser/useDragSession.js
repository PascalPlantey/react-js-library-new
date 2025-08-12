import { useRef } from "react";

import useEventListener from "./useEventListener";
import { useLast, useOnMount } from "../react";

import { getEventTarget, getEventClientXY } from "../../tools/browser";
import { noop } from "../../tools/misc";
import { isString } from "../../tools/is";

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
const useDragSession = (elt, exclude, onStart = noop, onMove = noop, onEnd = noop) => {
  const isDraggingRef = useRef(false);
  const refElt = useRef(getEventTarget(elt));
  const excludeListRef = useLast(isString(exclude) ? [exclude] : exclude),
        onStartRef = useLast(onStart),
        onMoveRef = useLast(onMove),
        onEndRef = useLast(onEnd);
  const startFromRef = useRef({});

  const { toggle : togglePointerUp } = useEventListener("pointerup", handleDragEnd, refElt, false);
  const { toggle : togglePointerMove } = useEventListener("pointermove", handleDragMove, refElt, false);
  const { toggle : togglePointerDown } = useEventListener("pointerdown", handleDragStart, refElt, refElt.current !== undefined);

  useOnMount(() => {
    if (refElt.current === undefined) {
      refElt.current = getEventTarget(elt);

      if (refElt.current !== undefined)                     // We can start listening to drag start events
        togglePointerDown();
    }
  });

  const toggleAllListeners = () => {
    togglePointerMove();
    togglePointerUp();
  }

  const returnValue = event => {
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
    toggleAllListeners();
    onStartRef.current(returnValue(event));
  }

  function handleDragMove(event) {
    if (!isDraggingRef.current) return;
    event.stopPropagation();

    onMoveRef.current(returnValue(event));
  }

  function handleDragEnd(event) {
    if (!isDraggingRef.current) return;
    event.stopPropagation();

    isDraggingRef.current = false;
    toggleAllListeners();
    onEndRef.current(returnValue(event));
  }
};

export default useDragSession;
