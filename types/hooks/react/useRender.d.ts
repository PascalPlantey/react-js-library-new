export default useRender;
export type useRenderActions = {
    /**
     * - Set the value
     */
    setValue: (value: any) => void;
};
export type useRenderReturn = [any, useRenderActions];
/**
 * @typedef {Object} useRenderActions
 * @property {(value: any) => void} setValue - Set the value
 */
/**
 * @typedef {[any, useRenderActions]} useRenderReturn
 */
/**
 * Custom React hook that returns a function to force a component re-render.
 * Utilizes the `useBoolean` hook's toggle method to trigger a state change.
 *
 * @returns {Function} A function that, when called, forces the component to re-render.
 */
declare function useRender(): Function;
