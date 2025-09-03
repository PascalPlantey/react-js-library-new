import { useCallback, useEffect, useState } from 'react';

import { Preferences } from '@capacitor/preferences';

/**
 * Custom React hook for persisting state using Capacitor Preferences storage.
 *
 * @param {string} key - The key under which the value is stored in Capacitor Preferences.
 * @param {*} defaultValue - The default value to use if nothing is stored.
 * @returns {Array} - Returns [value, updateValue] where value is the current stored value and updateValue is an async function to update it.
 */
const useCapacitorStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    (async () => {
      const { value: stored } = await Preferences.get({ key });
      setValue(stored ? JSON.parse(stored) : defaultValue);
    })();
  }, [defaultValue, key]);

  const updateValue = useCallback(newValue => {
    setValue(newValue);
    Preferences.set({ key, value: JSON.stringify(newValue) });    // Promise result not checked
  }, [key]);

  return [value, updateValue];
};

export default useCapacitorStorage;