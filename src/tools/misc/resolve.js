import isFunction from "../is/isFunction";

/**
 * Resolves a value or a function. If the first argument is a function, it is called with the fallback and any additional arguments.
 * Otherwise, returns the value or the fallback if the value is nullish.
 *
 * @param {Function|any} fnOrValue - A function to be called or a value to be returned.
 * @param {any} fallback - The fallback value to use if fnOrValue is nullish or to pass as the first argument to the function.
 * @param {...any} args - Additional arguments to pass to the function if fnOrValue is a function.
 * @returns {any} The resolved value.
 */
const resolve = (fnOrValue, fallback, ...args) => {
  if (isFunction(fnOrValue))  return fnOrValue(fallback, ...args);
  else                        return fnOrValue ?? fallback;
};

export default resolve;