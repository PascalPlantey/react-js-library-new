export default useObject;
/**
 * Use an object as state with basic operations. Useful to avoid managing operations like setState(prev => ({ ...prev, other: 4 })
 * @param {object} [initialState={}] Object value to use for initialization
 * @returns {object} { object, set: object => void, assign: object => void, remove: string|string[] => void, reset: void => void, clear: void => void, render: void => void }
 * @example
 * const {
 *   object,                      // Current object value
 *   set,                         // set(object) -> replace current object
 *   assign,                      // assign(object) -> assign new properties
 *   remove,                      // remove(string|Array<string>) -> remove properties
 *   reset,                       // reset() -> object restored to initial state
 *   clear,                       // clear() -> object becomes {}
 * } = useObject({ gamma: 3 });   // object { gamma: 3 };
 *
 * assign({ beta: 2, zeta: 4 });  // object { gamma: 3, beta: 2, zeta: 4 }
 * assign({ zut: 'done' });       // object { gamma: 3, beta: 2, zeta: 4, zut: 'done' }
 * remove('gamma');               // object { beta: 2, zeta: 4, zut: 'done' }
 * remove(['beta', 'teta']);      // object { zeta: 4, zut: 'done' }
 * reset();                       // object { gamma: 3 };
 * set({ car: 'Honda' });         // object { car: 'Honda' }
 * clear();                       // object {}
 */
declare function useObject(initialState?: object): object;
