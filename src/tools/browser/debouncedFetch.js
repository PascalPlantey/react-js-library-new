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
const debouncedFetch = (delay = 300) => {
  const fetchMap = new Map();

  return (url, options = {}) => {
    if (fetchMap.has(url)) {
      const { timeoutId, abortController } = fetchMap.get(url);
      clearTimeout(timeoutId);
      if (abortController) abortController.abort();
    }

    const abortController = new AbortController();

    let resolvePromise, rejectPromise;
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    const timeoutId = setTimeout(() => {
      fetch(url, { ...options, signal: abortController.signal })
        .then(response => response.json())
        .then(data => resolvePromise(data))
        .catch(error => rejectPromise(error))
        .finally(() => fetchMap.delete(url));
    }, delay);

    fetchMap.set(url, { timeoutId, abortController });
    return promise;
  };
};

export default debouncedFetch;