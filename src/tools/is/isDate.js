/**
 * Checks if the provided value is a valid Date object or a valid date string.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns true if the value is a valid Date object or a valid date string, otherwise false.
 */
const isDate = value => {
  if (value instanceof Date && !isNaN(value))
    return true;

  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date);
  }

  return false;
};

export default isDate;