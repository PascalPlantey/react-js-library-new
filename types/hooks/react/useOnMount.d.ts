export default useOnMount;
/**
 * Hook that executes code once (and only once) after the component has been mounted
 *
 * @param {() => void} fn - Callback function
 * @returns {*} - The return value of the callback function (stable, will not change)
 *
 * @example
 * // Basic usage
 * src\hooks\react\useOnMount(() => console.log('callback'));
 */
declare function useOnMount(fn: () => void): any;
