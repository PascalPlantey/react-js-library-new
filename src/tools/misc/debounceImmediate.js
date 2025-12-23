/**
 * Creates a debounced function that invokes the provided function immediately,
 * then ignores subsequent calls until after the specified delay has elapsed.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} [delay=300] - The number of milliseconds to wait before allowing the next invocation.
 * @returns {Function} A debounced version of the provided function.
 */
const debounceImmediate = (fn, delay = 300) => {
  // console.log("debounceImmediate called", fn.toString(), delay); // Debug log
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    // console.log("debounceImmediate executing function", fn.toString(), args); // Debug log
    return fn.apply(this, args);
  };
};

export default debounceImmediate;