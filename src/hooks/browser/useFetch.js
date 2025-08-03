
import { useEffect, useRef, useCallback } from 'react';

import { useLast } from '../react';
import { useObject, useBoolean } from '../utils';

const initialObj = {
  loading: true,
  ok: undefined,
  status: undefined,
  statusText: undefined,
  data: undefined,
  error: undefined
};

/**
 * Abortable fetch hook that provides a simple interface for making HTTP requests
 *
 * @param {string} api Base API URL
 * @param {string} url Endpoint to fetch
 * @param {Object} [options] Fetch options
 * @param {number} [debounce=0] Debounce delay in ms (0 = pas de debounce)
 * @returns {[Object, Function, Function]} Tuple containing:
 * - Fetch result object with properties: loading, ok, status, statusText, data, error
 * - Function to toggle the fetch state
 * - Function to abort the fetch request
 * 
 * @example
 * const result = useFetch();
 */
const useFetch = (api, url, options, debounce = 0) => {
  const refController = useRef(undefined);
  const optionsRef = useLast(options);
  const { value, toggle } = useBoolean();
  const { object, set } = useObject(initialObj);

  const abort = useCallback(() => {
    refController.current?.abort();
  }, []);

  useEffect(() => {
    set({ loading: true, error: undefined });

    let timer;
    const doFetch = () => {
      refController.current = new AbortController();

      fetch(encodeURI(new URL(api, url)), { ...optionsRef.current, signal: refController.current.signal })
      .then(async result => {
        const { ok, status, statusText } = result;
        let data;
        try {
          data = await result.json();
          set({ loading: false, ok, status, statusText, data, error: undefined });
        } catch (error) {
          data = undefined;
          set({ loading: false, ok, status, statusText, data, error });
        }
      })
      .catch(error => set({ loading: false, ok: false, error }));
    };

    if (debounce > 0) timer = setTimeout(doFetch, debounce);
    else              doFetch();

    return () => {
      if (timer) clearTimeout(timer);
      refController.current?.abort();
    };
  }, [api, url, optionsRef, value, set, debounce]);

  return [object, toggle, abort];
};

export default useFetch;