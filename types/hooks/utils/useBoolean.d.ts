export default useBoolean;
/**
 * Custom React hook to manage a boolean state with utility functions.
 *
 * @param {boolean} [initial=false] - The initial boolean value.
 * @returns {{
 *  value: boolean,
 *   setValue: React.Dispatch<React.SetStateAction<boolean>>,
 *   setTrue: () => void,
 *   setFalse: () => void,
 *   toggle: () => void
 * }} An object containing:
 *   - value: The current boolean value.
 *   - setValue: Sets the boolean value directly.
 *   - setTrue: Sets the value to true.
 *   - setFalse: Sets the value to false.
 *   - toggle: Toggles the boolean value.
 */
declare function useBoolean(initial?: boolean): {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
};
