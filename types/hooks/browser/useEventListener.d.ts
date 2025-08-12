export default useEventListener;
/**
 * @description Fire a function when a document event happens
 * @param {string} name Event name (mouseup, mousemove, ...)
 * @param {(event: Event) => any} fn
 * @param {Element|Window|Document|null} [elt=window]
 * @param {boolean} [immediately=true] Listen immediately or after toggle()
 * @param {object} [options={}] { capture, once, passive } [see Mozilla]{@link https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener}
 * @returns {object} { working: boolean, toggle: function() {} }
 * @example
 * const { working, toggle } = useEventListener('mousemove', console.log);
 *
 * @maintenance
 *  . 28/12/2023: changed useOnmount by useEffect to restart listening when listener (startListener) changes
 *  . 29/12/2023: make sure stopListener is called on startListener changes & clear the AbortController in stopListener
 *  . 09/01/2024: updated some dependencies and checking that fn is a Function
 *  . 21/06/2025: added a refFn to always the latest fn reference avoiding useEffect/useCallback dependencies issues
 */
declare function useEventListener(name: string, fn: (event: Event) => any, elt?: Element | Window | Document | null, immediately?: boolean, options?: object): object;
