import isEqual from 'lodash.isequal';

import usePrev from "./usePrev";

import isFunction from '../../tools/is/isFunction';

/**
 * Custom React hook that determines if the provided value has changed since the last render.
 *
 * @param {*} value - The value to monitor for changes.
 * @returns {boolean} - Returns true if the value has changed since the previous render, otherwise false.
 */
const useHasChanged = value => {
  const prevValue = usePrev(value);

  if (isFunction(value) || isFunction(prevValue))
    return prevValue?.toString() !== value?.toString();
  else
    return !isEqual(prevValue, value);
};

export default useHasChanged;