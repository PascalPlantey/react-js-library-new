import React, { useCallback, useEffect } from "react";

import useEventListener from "./useEventListener";

/**
 * Custom React hook that detects clicks or touches outside of a referenced element.
 * 
 * @param {React.RefObject} ref - A React ref object pointing to the element to monitor
 * @param {Function} handler - Callback function to execute when a click/touch occurs outside the referenced element
 * @returns {{ working: boolean, toggle: Function }} An object containing:
 *   - working: Boolean indicating if the listener is currently active
 *   - toggle: Function to toggle the listener on/off
 * 
 * @example
 * const ref = useRef(null);
 * const handleClickOutside = (event) => {
 *   console.log('Clicked outside!');
 * };
 * const { working, toggle } = useOnClickOutside(ref, handleClickOutside);
 */
const useOnClickOutside = (ref, handler) => {
  const listener = event => {
    if (!ref.current || ref.current.contains(event.target)) return;
    handler(event);
  };

  const mouseDown = useEventListener("mousedown", listener, document);
  const touchDown = useEventListener("touchdown", listener, document);
  const working = mouseDown.working && touchDown.working;

  const toggle = useCallback(() => {
    if (!working) {
      mouseDown.startListener();
      touchDown.startListener();
    } else {
      mouseDown.stopListener();
      touchDown.stopListener();
    }
  }, [working, mouseDown.startListener, mouseDown.stopListener, touchDown.startListener, touchDown.stopListener]);

  return { working, toggle };
};

export default useOnClickOutside;