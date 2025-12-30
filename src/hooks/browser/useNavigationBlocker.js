import { useEffect, useRef } from "react";

import { useBlocker } from "react-router-dom";

import useEventListener from "./useEventListener";
import useLast from "../react/useLast";

import isFunction from "../../tools/is/isFunction";

/**
 * Custom React hook to block navigation when certain conditions are met.
 *
 * This hook prevents both internal navigation (via React Router) and hard navigation
 * (such as browser refresh, tab close, or direct URL entry) if `shouldBlock` is true.
 * When a navigation attempt is detected, it calls the `showConfirm` function to prompt
 * the user for confirmation. If the user confirms, navigation proceeds; otherwise, it is canceled.
 *
 * @param {boolean} shouldBlock - Determines whether navigation should be blocked.
 * @param {function} showConfirm - Asynchronous function that shows a confirmation dialog to the user.
 *
 * @returns {void}
 */
const useNavigationBlocker = (shouldBlock, showConfirm) => {
  console.assert(isFunction(showConfirm), `useNavigationBlocker: showConfirm is not a function: ${showConfirm}`);

  const confirmFnRef = useLast(showConfirm);
  const { state, proceed, reset } = useBlocker(({ currentLocation, nextLocation }) =>
    shouldBlock && currentLocation.pathname !== nextLocation.pathname
  );

  // Block hard navigation (browser close, refresh, etc.): standard message is shown by the browser
  useEventListener('beforeunload', e => { if (shouldBlock) e.returnValue = 'block'; });

  // Block internal react router navigation
  useEffect(() => {
    (async () => {
      if (state === "blocked") {
        const confirmed = await confirmFnRef.current();
        confirmed ? proceed() : reset();
      }
    })();
  }, [state, proceed, reset, shouldBlock, confirmFnRef]);
};

export default useNavigationBlocker;