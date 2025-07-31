import { useEffect, useState } from 'react';

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
    const loadValue = async () => {
      const { value: stored } = await Preferences.get({ key });
      setValue(stored ? JSON.parse(stored) : defaultValue);
    };
    loadValue();
  }, [defaultValue, key]);

  const updateValue = async (newValue) => {
    setValue(newValue);
    await Preferences.set({ key, value: JSON.stringify(newValue) });
  };

  return [value, updateValue];
};

export default useCapacitorStorage;