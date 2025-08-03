import { useState, useCallback } from "react";


/**
 * Custom React hook to manage a boolean state with utility functions.
 *
 * @param {boolean} [initial=false] - The initial boolean value.
 * @returns {[value: boolean, {
 *   setValue: React.Dispatch<React.SetStateAction<boolean>>,
 *   setTrue: () => void,
 *   setFalse: () => void,
 *   toggle: () => void
 * }]} An array containing the current boolean value and an object with utility functions:
 *   - setValue: Sets the boolean value directly.
 *   - setTrue: Sets the value to true.
 *   - setFalse: Sets the value to false.
 *   - toggle: Toggles the boolean value.
 */
const useBoolean = (initial = false) => {
  const [value, setValue] = useState(!!initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(prev => !prev), []);

  return ({
    value,
    setValue,
    setTrue,
    setFalse,
    toggle
  });
};

export default useBoolean;