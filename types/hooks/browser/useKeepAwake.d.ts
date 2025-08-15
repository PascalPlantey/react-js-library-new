export default useKeepAwake;
/**
 * React hook that prevents the device from sleeping with pause/resume control.
 * Works on native platforms using Capacitor and the KeepAwake plugin.
 *
 * @param {boolean} [initiallyActive=true] - Whether to start with keep awake enabled
 * @returns {object} { isActive: boolean, activate: function, deactivate: function }
 * @example
 * const { isActive, activate, deactivate } = useKeepAwake(); // Active at startup
 */
declare function useKeepAwake(initiallyActive?: boolean): object;
