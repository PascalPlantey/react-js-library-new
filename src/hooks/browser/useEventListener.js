import { useCallback, useEffect, useRef, useState } from 'react';

import useLast from '../react/useLast';

import isFunction from '../../tools/is/isFunction';
import getEventTarget from '../../tools/browser/getEventTarget';

/**
 * @description Fire a function when a document event happens
 * @param {string} name Event name (mouseup, mousemove, ...)
 * @param {(event: Event) => any} fn
 * @param {Element|Window|Document|null} [elt=window]
 * @param {boolean} [immediately=true] Listen immediately or after toggle()
 * @param {object} [options={}] { capture, once, passive } [see Mozilla]{@link https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener}
 * @returns {object} { working: boolean, toggle: function() {} }
 * @example
 * const { working, toggle } = useEventListener('mousemove', console.log);
 *
 * @maintenance
 *  . 28/12/2023: changed useOnmount by useEffect to restart listening when listener (startListener) changes
 *  . 29/12/2023: make sure stopListener is called on startListener changes & clear the AbortController in stopListener
 *  . 09/01/2024: updated some dependencies and checking that fn is a Function
 *  . 21/06/2025: added a fnRef to always the latest fn reference avoiding useEffect/useCallback dependencies issues
 *  . 30/12/2025: useLast for elt to avoid unnecessary restarts when elt is stable
 */
const useEventListener = (name, fn, elt = window, immediately = true, options = {}) => {
  const [working, setWorking] = useState(!!immediately);
  const { capture, once, passive } = options;
  const refAbort = useRef(undefined);
  const refElt = useLast(getEventTarget(elt));
  const element = refElt.current;
  const fnRef = useLast(fn);                                        // Always keep the latest fn reference

  console.assert(isFunction(fn), `useEventListener: fn is not a function: ${fn}`);

  /**
   * Stops the event listener by aborting the current AbortController instance.
   * This effectively removes the event listener and cleans up the reference.
   */
  const stopListener = useCallback(() => {
    if (refAbort.current) {
      // console.log('stopping event listener for', name);
      refAbort.current.abort();
      refAbort.current = undefined;
    }
  }, []);

  // Get an abort signal to make sure our listener can be stopped anytime
  const startListener = useCallback(() => {
    // Use our own listener to track if it is automatically removed by the browser (options.once === true)
    const listener = evt => {
      fnRef.current(evt);                                           // Callback to the latest function with the event
      if (once) {
        refAbort.current = undefined;                               // Listener has been stopped
        setWorking(false);                                          // Listener has been called and eventListener automatically removed
      }
    };

    if (refElt.current) {
      stopListener();                                               // Stop listening if it already started
      refAbort.current = new AbortController();                     // Restart with a a new AbortController for this listener
      // console.log('starting event listener for', name);
      refElt.current?.addEventListener(name, listener, { capture, once, passive, signal: refAbort.current.signal });
    }
  }, [capture, once, passive, name, stopListener]);

  useEffect(() => {                                                 // (Re)Start listener when it changes
    if (working)
      startListener();

    return stopListener;                                            // Cleanup listener when component unmounts or when startListener changes
  }, [working, element, startListener, stopListener]);

  const toggle = useCallback(() => {
    setWorking(running => !running);
  }, []);

  return({
    working,
    toggle,
    startListener,
    stopListener
  });
};

export default useEventListener;