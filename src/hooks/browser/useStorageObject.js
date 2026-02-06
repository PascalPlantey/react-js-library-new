import { useCallback } from "react";

import useStorageItem from './useStorageItem.js';
import { emptyObject } from "../../tools/misc/emptyObject.js";

/**
 * Custom React hook for managing an object in localStorage or sessionStorage.
 *
 * @param {string} key - The storage key to use.
 * @param {Object} [defaultObj=emptyObject] - The default object value if none exists in storage.
 * @param {boolean} [local=true] - If true, uses localStorage; otherwise, uses sessionStorage.
 * @returns {[object, function, function, function]} An array containing:
 *   An array containing:
 *     - The current object from storage.
 *     - A setter function to update the entire object.
 *     - A function to update a specific property of the object.
 *     - A function to remove the object from storage.
 */
const useStorageObject = (key, defaultObj = emptyObject, local = true) => {
  const [obj, setObj, remove] = useStorageItem(key, defaultObj, local);
  
  const updateProperty = useCallback((prop, value) => {
    setObj(prev => ({ ...prev, [prop]: value }));
  }, [setObj]);

  return [obj, setObj, updateProperty, remove];
};

export default useStorageObject;