import { useCallback, useEffect, useState } from 'react';

import { useNewClassRef } from '../utils';

import { StorageItem } from '../../tools';

/**
 * Custom React hook for managing a value in localStorage or sessionStorage with state synchronization.
 *
 * @param {string} key - The storage key to use.
 * @param {*} [def=''] - The default value to use if the key does not exist in storage.
 * @param {boolean} [local=true] - If true, uses localStorage; if false, uses sessionStorage.
 * @returns {[any, function, function]} 
 *   An array containing:
 *     - The current value from storage.
 *     - A setter function to update the value.
 *     - A function to remove the key from storage and reset the state.
 */
const useStorageItem = (key, def = '', local = true) => {
  const storage = useNewClassRef(() => new StorageItem(key, def, local)); // Holds the StorageItem object
  const [value, setValue] = useState(storage.value);                      // Restore current if exists in storage

  useEffect(() => { storage.value = value; }, [storage, value]);          // Save on change

  const removeKey = useCallback(() => {
    storage.remove();
    setValue(undefined);
  }, [storage]);

  return [
    value,
    setValue,                                                             // Change the StorageItem value & set the state
    removeKey                                                             // Remove the key from storage and reset state
  ];
};

export default useStorageItem;