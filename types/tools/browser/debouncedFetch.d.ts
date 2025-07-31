export default debouncedFetch;
/**
 * Creates a debounced fetch function that delays network requests for the same URL.
 * If multiple calls are made to the same URL within the specified delay, only the last one is executed.
 * Previous pending requests for the same URL are aborted.
 *
 * @param {number} [delay=300] - The debounce delay in milliseconds.
 * @returns {(url: string, options?: RequestInit) => Promise<any>} A debounced fetch function.
 *
 * @example
 * const fetchWithDebounce = debouncedFetch(500);
 * fetchWithDebounce('/api/data').then(data => console.log(data));
 */
declare function debouncedFetch(delay?: number): (url: string, options?: RequestInit) => Promise<any>;
