import { useEffect } from "react";

import { useBlocker } from "react-router-dom";

import useEventListener from "./useEventListener";

/**
 * Custom React hook to block navigation when certain conditions are met.
 *
 * This hook prevents both internal navigation (via React Router) and hard navigation
 * (such as browser refresh, tab close, or direct URL entry) if `shouldBlock` is true.
 * When a navigation attempt is detected, it calls the `showConfirm` function to prompt
 * the user for confirmation. If the user confirms, navigation proceeds; otherwise, it is canceled.
 *
 * @param {boolean} shouldBlock - Determines whether navigation should be blocked.
 * @param {function(): Promise<boolean>} showConfirm - Async function that shows a confirmation dialog and resolves to true if the user confirms, false otherwise.
 *
 * @returns {void}
 */
const useNavigationBlocker = (shouldBlock, showConfirm) => {
  const { state, proceed, reset } = useBlocker(({ currentLocation, nextLocation }) =>
    shouldBlock && currentLocation.pathname !== nextLocation.pathname
  );

  // Block hard navigation (browser close, refresh, etc.)
  useEventListener('beforeunload', e => {
    if (shouldBlock) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Block internal react router navigation
  useEffect(() => {
    (async () => {
      if (state === "blocked") {
        const confirmed = await showConfirm();
        confirmed ? proceed() : reset();
      }
    })();
  }, [state, proceed, reset, shouldBlock, showConfirm]);
};

export default useNavigationBlocker;