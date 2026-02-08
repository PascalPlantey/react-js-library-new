import usePrev from "./usePrev";

/**
 * Custom React hook that determines if the provided value has changed since the last render. Only useful for debugging
 * or to trigger effects on changes without caring about the previous value itself
 *
 * @param {*} value - The value to monitor for changes.
 * @returns {boolean} - Returns true if the value has changed since the previous render, otherwise false.
 */
const useHasChanged = value => {
  const [prevValue, isFirstRender] = usePrev(value);
  return !isFirstRender && prevValue !== value;
};

export default useHasChanged;