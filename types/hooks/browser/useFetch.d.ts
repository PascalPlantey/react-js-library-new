export default useFetch;
/**
 * Abortable fetch hook that provides a simple interface for making HTTP requests
 *
 * @param {string} api Base API URL
 * @param {string} url Endpoint to fetch
 * @param {Object} [options] Fetch options
 * @param {number} [debounce=0] Debounce delay in ms (0 = pas de debounce)
 * @returns {[Object, Function, Function]} Tuple containing:
 * - Fetch result object with properties: loading, ok, status, statusText, data, error
 * - Function to toggle the fetch state (re-fetch)
 * - Function to abort the fetch request
 *
 * @example
 * const result = useFetch();
 */
declare function useFetch(api: string, url: string, options?: any, debounce?: number): [any, Function, Function];
