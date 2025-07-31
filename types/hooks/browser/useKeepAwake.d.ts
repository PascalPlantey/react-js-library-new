export default useKeepAwake;
export type UseKeepAwakeReturn = {
    /**
     * - Whether keep awake is currently active
     */
    isActive: boolean;
    /**
     * - Activate keep awake
     */
    activate: () => Promise<void>;
    /**
     * - Deactivate keep awake
     */
    deactivate: () => Promise<void>;
    /**
     * - Toggle keep awake state
     */
    toggle: () => Promise<void>;
    /**
     * - Pause keep awake
     */
    pause: () => void;
    /**
     * - Resume keep awake
     */
    resume: () => void;
};
/**
 * @typedef {Object} UseKeepAwakeReturn
 * @property {boolean} isActive - Whether keep awake is currently active
 * @property {() => Promise<void>} activate - Activate keep awake
 * @property {() => Promise<void>} deactivate - Deactivate keep awake
 * @property {() => Promise<void>} toggle - Toggle keep awake state
 * @property {() => void} pause - Pause keep awake
 * @property {() => void} resume - Resume keep awake
 */
/**
 * React hook that prevents the device from sleeping with pause/resume control.
 * Works on native platforms using Capacitor and the KeepAwake plugin.
 *
 * @param {boolean} [initiallyActive=true] - Whether to start with keep awake enabled
 * @returns {object} { isActive: boolean, activate: function, deactivate: function, toggle: function }
 * @example
 * const { isActive, activate, deactivate, toggle } = useKeepAwake();
 * const { isActive, toggle } = useKeepAwake(false); // Start inactive
 */
declare function useKeepAwake(initiallyActive?: boolean): object;
