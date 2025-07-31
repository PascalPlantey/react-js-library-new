export default useCounter;
export type UseCounterActions = {
    /**
     * - Set counter value directly
     */
    setValue: (value: number | ((prev: number) => number)) => void;
    /**
     * - Increment counter by step (default 1)
     */
    increment: (step?: number) => void;
    /**
     * - Decrement counter by step (default 1)
     */
    decrement: (step?: number) => void;
    /**
     * - Reset counter to initial value
     */
    reset: () => void;
    /**
     * - Alias for setValue
     */
    set: (value: number) => void;
};
export type UseCounterReturn = [number, UseCounterActions];
/**
 * @typedef {Object} UseCounterActions
 * @property {(value: number | ((prev: number) => number)) => void} setValue - Set counter value directly
 * @property {(step?: number) => void} increment - Increment counter by step (default 1)
 * @property {(step?: number) => void} decrement - Decrement counter by step (default 1)
 * @property {() => void} reset - Reset counter to initial value
 * @property {(value: number) => void} set - Alias for setValue
 */
/**
 * @typedef {[number, UseCounterActions]} UseCounterReturn
 */
/**
 * Hook for managing counter state with increment/decrement utilities
 * @param {number} [initial=0] Initial counter value
 * @returns {Array} [value, { setValue, increment, decrement, reset }]
 */
declare function useCounter(initial?: number): any[];
