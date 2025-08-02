export default truncateAndTrail;
/**
 * Truncates a string to a specified length and appends a trailing string if truncation occurs.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} n - The maximum allowed length of the resulting string including the trail.
 * @param {string} [trail="..."] - The string to append if truncation occurs.
 * @returns {string} The truncated string with the trail appended if truncation occurred, or the original string if no truncation was needed. Returns an empty string if input is not a valid string or is too short.
 */
declare function truncateAndTrail(str: string, n: number, trail?: string): string;
