export default useOnMount;
/**
 * Hook that executes code once after the component has been mounted
 *
 * @param {() => void} fn - Callback function
 * @returns {void}
 *
 * @example
 * // Basic usage
 * src\hooks\react\useOnMount(() => console.log('callback'));
 */
declare function useOnMount(fn: () => void): void;
