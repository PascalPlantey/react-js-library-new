import { useRef } from "react";

import isFunction from "../../tools/is/isFunction";

/**
 * Creates a reference from the result of a function. If a reference is initialized with a 'new class()' the object will be constructed
 * at every render, even if this new object will not be used. The useNewClassRef avoids this pittfall, see
 * https://react.dev/reference/react/useRef for more
 * 
 * @param {function} func Function to execute once
 * @returns {any} The new object created
 * 
 * @example
 * const ref = useNewClassRef(() => new ExtMap());
 */
const useNewClassRef = func => {
  const ref = useRef();

  if (!ref.current) {
    if (!isFunction(func))
      console.warn("useNewClassRef, requires a function that returns a new object got:", typeof func);

    ref.current = func();
  }

  return ref.current;
};

export default useNewClassRef;