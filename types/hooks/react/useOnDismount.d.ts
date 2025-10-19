export default useOnDismount;
/**
 * Custom React hook that invokes a callback function when the component is unmounted.
 *
 * @param {Function} fn - The function to be called on component unmount
 * @returns {*} - The return value of the callback function (stable, will not change)
 */
declare function useOnDismount(fn: Function): any;
