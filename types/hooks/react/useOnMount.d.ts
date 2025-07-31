export default useOnMount;
/**
 * Hook that executes code when component mounts
 *
 * @param {() => void} fn - Callback function
 * @returns {void}
 *
 * @example
 * // Basic usage
 * src\hooks\react\useOnMount(() => console.log('callback'));
 */
declare function useOnMount(fn: () => void): void;
