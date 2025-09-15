import { useRef } from "react";

import isEqual from 'lodash.isequal';

/**
 * Hook that provides a way to check if dependencies have changed, useful for development time
 *
 * @param {...any} deps - Dependencies to check for changes
 * @returns {[boolean : changed, [{ index: number, previous: any, current: any, cause: string }]]}
 * - Returns an array where the first element is a boolean indicating if any dependencies changed,
 *   and the second element is an array of objects describing the changes.
 *
 * @example
 * // Basic usage
 * useEffect(() => {}, [val1, val2]);
 * const [changed, changes] = useCheckDepsChanges(val1, val2);
 */
const useCheckDepsChanges = (...deps) => {
  const previousDepsRef = useRef(Array.from(deps));
  console.assert(deps.length === previousDepsRef.current.length, 'Dependencies length mismatch');

  const changes = [];
  deps.forEach((dep, index) => {
    if (dep !== previousDepsRef.current[index]) {
      const change = { index, previous: previousDepsRef.current[index], current: dep };

      if (!isEqual(change.previous, change.current))
        changes.push({ ...change, cause: 'value content has been modified' });
      else
        changes.push({ ...change, cause: 'reference has changed' });
    }
  });

  if (changes.length > 0)
    previousDepsRef.current = Array.from(deps);

  return [changes.length > 0, changes];
};

export default useCheckDepsChanges;
