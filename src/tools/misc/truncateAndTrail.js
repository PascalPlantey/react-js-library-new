import { isString } from "../is";

/**
 * Truncates a string to a specified length and appends a trailing string if truncation occurs.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} n - The maximum allowed length of the resulting string including the trail.
 * @param {string} [trail="..."] - The string to append if truncation occurs.
 * @returns {string} The truncated string with the trail appended if truncation occurred, or the original string if no truncation was needed. Returns an empty string if input is not a valid string or is too short.
 */
const truncateAndTrail = (str, n, trail = "...") => {
  const strlen = str ? str.length : 0,
        traillen = trail ? trail.length : 0;

  if (!isString(str) || strlen <= traillen) return str;

  return strlen > n ? str.slice(0, n - traillen) + trail : str;
};

export default truncateAndTrail;