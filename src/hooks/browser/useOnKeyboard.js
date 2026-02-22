import { useEffect } from "react";

import useEventListener from "./useEventListener";

/**
 * Custom React hook that listens for a specific keyboard key press and triggers a callback.
 *
 * @param {string} key - The keyboard key to listen for (e.g., 'Enter', 'Escape').
 * @param {boolean} enable - Whether the event listener should be active.
 * @param {Function} callback - The function to call when the specified key is pressed.
 *
 * @example
 * useOnKeyboard('Escape', isModalOpen, handleClose);
 */
const useOnKeyboard = (key, enable, callback) => {
  const { startListener, stopListener } =
    useEventListener('keydown', e => {
      if (e.key === key) {
        e.preventDefault();   // Prevent default action for the key press (e.g., form submission on Enter)
        e.stopPropagation();  // Stop the event from propagating further (e.g., to avoid triggering other handlers)
        callback(e);
      }
    }, window, enable);

  useEffect(() => {
    enable ? startListener() : stopListener();
  }, [enable, startListener, stopListener]);
};

export default useOnKeyboard;