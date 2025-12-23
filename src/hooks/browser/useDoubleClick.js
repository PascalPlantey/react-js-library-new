import { useCallback, useRef } from "react";

import noop from './../../tools/misc/noop.js';
import useEventListener from "./useEventListener.js";
import debounceImmediate from './../../tools/misc/debounceImmediate.js';
import useLast from "./../react/useLast.js";

/**
 * Custom React hook to handle double-click events on a referenced element. Useful for
 * mobile devices where double-click events may not be natively supported.
 *
 * Attaches both 'dblclick' and 'click' event listeners to the document.
 * When a double-click is detected on the referenced element, the provided callback is invoked.
 * Handles both native double-clicks and two rapid single clicks within 300ms.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref of the element to detect double-clicks on.
 * @param {Function} [onDblClick=noop] - Callback function to execute on double-click.
 * @param {number} [timeout=300] - Time window in milliseconds to detect two rapid clicks as a double-click.
 */
const useDoubleClick = (ref, onDblClick = noop, timeout = 300) => {
  const clickCountRef = useRef(0);                // Count of quick clicks on mobile
  const onDblClickRef = useLast(onDblClick);      // Latest onDblClick callback
  const debouncedDblClickRef = useRef(debounceImmediate(() => onDblClickRef.current()));

  const handleDblClick = e => {
    if (ref.current && ref.current.contains(e.target))
      debouncedDblClickRef.current(e);
  };

  // Standard double-click event listener
  useEventListener('dblclick', handleDblClick);

  // Custom double-click detection for mobile (two clicks within timeout ms)
  useEventListener('click', e => {
    clickCountRef.current += 1;
    setTimeout(() => clickCountRef.current = 0, timeout);

    if (clickCountRef.current === 2) {
      handleDblClick(e);
      clickCountRef.current = 0;
    }
  });
};

export default useDoubleClick;