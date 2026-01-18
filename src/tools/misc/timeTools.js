/**
 * Converts a time value to a Date object.
 * @param {Date|string|number} time - The time to convert. Can be a Date object, a date string, or a timestamp number.
 * @returns {Date} A Date object representing the provided time.
 * @throws {Error} Throws an error if the provided time cannot be converted to a valid date.
 */
export const toDate = time => {
  const date = time instanceof Date ? time : new Date(time);
  if (isNaN(date))
    throw new Error('Invalid date format');
  return date;
};

/**
 * Returns the ISO week number for a given date.
 *
 * The ISO week starts on Monday and the first week of the year is the one that contains the first Thursday.
 *
 * @param {Date} [date=new Date()] - The date for which to get the week number. Defaults to the current date if not provided.
 * @returns {number} The ISO week number (1-53).
 * @throws {Error} Throws an error if the provided date cannot be converted to a valid date.
 */
export const getWeekNumber = (date = new Date()) => {
  const when = toDate(date);
  // Jour de la semaine (1 = lundi, 7 = dimanche)
  const dayNum = when.getUTCDay() || 7;

  // On place la date au jeudi de la même semaine (ISO)
  when.setUTCDate(when.getUTCDate() + 4 - dayNum);
  // Début de l'année
  const yearStart = new Date(Date.UTC(when.getUTCFullYear(), 0, 1));

  return Math.ceil((((when - yearStart) / 86400000) + 1) / 7);
};

/**
 * Calculates the time difference between two dates.
 * 
 * @param {Date|string|number} time1 - The first date (Date object or valid date string/timestamp)
 * @param {Date|string|number} time2 - The second date (Date object or valid date string/timestamp)
 * @param {boolean} [full=false] - If true, returns all time units; otherwise returns only significant units
 * 
 * @returns {Object} An object containing the time difference broken down by units:
 *   - When full is true: { years, months, days, hours, minutes, seconds }
 *   - When full is false and diffInYears > 0: { years, months, days }
 *   - When full is false and diffInMonths > 0: { months, days, hours }
 *   - When full is false and diffInDays > 0: { days, hours, minutes }
 *   - Otherwise: { hours, minutes, seconds }
 * 
 * @throws {Error} Throws an error if the date format is invalid
 * 
 * @example
 * // Returns { hours: 5, minutes: 30, seconds: 0 }
 * timeDifference('2024-01-01T10:00:00', '2024-01-01T15:30:00');
 * 
 * @example
 * // Returns { years: 1, months: 2, days: 15, hours: 5, minutes: 30, seconds: 0 }
 * timeDifference('2022-10-15', '2024-01-01', true);
 */
export const timeDifference = (time1, time2, full = false) => {
  const start = toDate(time1);
  const end   = toDate(time2);
  const diffInMs = Math.abs(end - start);

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (full)
    return {
      years: diffInYears,
      months: diffInMonths % 12,
      days: diffInDays % 30,
      hours: diffInHours % 24,
      minutes: diffInMinutes % 60,
      seconds: diffInSeconds % 60,
    };

  if (diffInYears > 0)
    return {
      years: diffInYears,
      months: diffInMonths % 12,
      days: diffInDays % 30,
    };

  if (diffInMonths > 0)
    return {
      months: diffInMonths,
      days: diffInDays % 30,
      hours: diffInHours % 24,
    };

  if (diffInDays > 0)
    return {
      days: diffInDays,
      hours: diffInHours % 24,
      minutes: diffInMinutes % 60,
    };

  return {
    hours: diffInHours % 24,
    minutes: diffInMinutes % 60,
    seconds: diffInSeconds % 60,
  };
};

/**
 * Calculates the duration between two dates and returns a human-readable string.
 * 
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {string} A formatted duration string in French (e.g., "2 ans, 3 mois et 5 jours", "aujourd'hui")
 * 
 * @example
 * const start = new Date('2020-01-15');
 * const end = new Date('2023-04-20');
 * calculateDuration(start, end); // "3 ans, 3 mois et 5 jours"
 */
export const calculateDuration = (startDate, endDate) => {
  const { years, months, days } = timeDifference(startDate, endDate, true);
  const parts = [];

  if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mois`);
  if (days > 0) parts.push(`${days} jour${days > 1 ? 's' : ''}`);

  if (parts.length === 0) return "aujourd'hui";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" et ");

  return parts.slice(0, -1).join(", ") + " et " + parts[parts.length - 1];
};