import { useEffect } from "react";

import useEventListener from "./useEventListener";

/**
 * Checks if the keyboard event matches the specified modifier key options.
 *
 * @param {Object} options - Modifier key options to match against.
 * @param {boolean} [options.shift] - Whether the Shift key should be pressed.
 * @param {boolean} [options.ctrl] - Whether the Ctrl key should be pressed.
 * @param {boolean} [options.alt] - Whether the Alt key should be pressed.
 * @param {boolean} [options.meta] - Whether the Meta (Command/Windows) key should be pressed.
 * @param {KeyboardEvent} e - The keyboard event to check.
 * @returns {boolean} True if the event matches the options, false otherwise.
 */
const matchOptions = (options, e) => {
  if (options.shift !== undefined && options.shift !== e.shiftKey) return false;
  if (options.ctrl !== undefined && options.ctrl !== e.ctrlKey) return false;
  if (options.alt !== undefined && options.alt !== e.altKey) return false;
  if (options.meta !== undefined && options.meta !== e.metaKey) return false;
  return true;
};

/**
 * Custom React hook to handle keyboard events based on specified bindings.
 *
 * @param {Array<Object>} bindings - An array of keyboard binding objects.
 * Each binding object should have the following properties:
 *   @property {string} key - The key to listen for (e.g., 'Enter', 'Escape').
 *   @property {boolean} enabled - Whether the binding is active.
 *   @property {function} callback - Function to call when the key event matches.
 *   @property {Object} [options] - Optional additional options for matching (e.g., modifier keys).
 *   @property {boolean} [options.shift] - Whether the Shift key should be pressed.
 *   @property {boolean} [options.ctrl] - Whether the Ctrl key should be pressed.
 *   @property {boolean} [options.alt] - Whether the Alt key should be pressed.
 *   @property {boolean} [options.meta] - Whether the Meta key should be pressed.
 *
 * The hook attaches a 'keydown' event listener to the window when bindings are present,
 * and removes it when bindings are empty. It prevents default and stops propagation
 * when a matching binding is triggered.
 *
 * @returns {void}
 */
const useOnKeyboards = bindings => {
  const handleKeyDown = e => {
    const binding = bindings.find(b => b.key === e.key);
    if (binding) {
      const { enabled, callback, options = {}} = binding;

      if (enabled && matchOptions(options, e)) {
        e.preventDefault();   // Prevent default action for the key press (e.g., form submission on Enter)
        e.stopPropagation();  // Stop the event from propagating further (e.g., to avoid triggering other handlers)
        callback(e);
      }
    }
  };

  const { startListener, stopListener } = useEventListener('keydown', handleKeyDown, window, bindings.length > 0);

  useEffect(() => {
    bindings.length ? startListener() : stopListener();
  }, [bindings, startListener, stopListener]);
};

export default useOnKeyboards;