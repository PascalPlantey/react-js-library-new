/**
 * Converts a time Object to a Date object.
 * @param {Date|string|number} time - The time to convert. Can be a Date object, a date string, or a timestamp number.
 * @returns {Object} A Date object representing the provided time.
 * @throws {Error} Throws an error if the provided time cannot be converted to a valid date.
 */
export const toDate = time => {
  const date = time instanceof Date ? time : new Date(time);
  if (isNaN(date))
    throw new Error('Invalid date format');
  return date;
};
/**
 * Validates that a Date object matches the expected year, month, and day values.
 * Rejects dates corrected by JavaScript (e.g., 31/11 becomes 1/12).
 * 
 * @private
 */

/**
 * Parses a locale date string (e.g., '31/10/2026' for fr-FR) into a Date object.
 * Supports common formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
 *
 * @param {string|null|undefined} dateString - The date string to parse (e.g., '31/10/2026')
 * @param {string} [locale='fr-FR'] - The locale to determine the date format
 * @returns {Date|null|undefined} Returns:
 *   - Date object if valid
 *   - null if dateString is null/undefined (no value provided)
 *   - undefined if parsing fails (invalid date)
 */
export const parseLocaleDate = (dateString, locale = 'fr-FR') => {
  const isValidDateComponents = (date, year, month, day) => 
      !isNaN(date) &&
      date.getFullYear() === parseInt(year) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getDate() === parseInt(day);

  // null/undefined is valid (no value), return as-is
  if (dateString === null || dateString === undefined) return dateString;

  // Non-string is an error
  if (typeof dateString !== 'string') return undefined;
  // Empty string means no date, return null
  if (dateString.trim().length === 0) return null;

  const trimmed = dateString.trim();

  // Format: DD/MM/YYYY or MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    let day, month, year;

    if (locale.startsWith('fr') || locale.startsWith('de') || locale.startsWith('it'))
      [day, month, year] = parts; // FR/DE/IT format: DD/MM/YYYY
    else
      [month, day, year] = parts; // US/EN format: MM/DD/YYYY

    const date = new Date(year, parseInt(month) - 1, day);
    return isValidDateComponents(date, year, month, day) ? date : undefined;
  }

  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split('-');
    const [year, month, day] = parts;
    const date = new Date(trimmed);
    return isValidDateComponents(date, year, month, day) ? date : undefined;
  }

  // No format matched - parsing error
  return undefined;
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
  const start = toDate(time1), end = toDate(time2);

  // Always go from earlier to later
  const [from, to] = start < end ? [start, end] : [end, start];

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    // Get days in previous month
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  if (full)
    return { years, months, days, hours, minutes, seconds };
  else if (years > 0)
    return { years, months, days };
  else if (months > 0)
    return { months, days, hours };
  else if (days > 0)
    return { days, hours, minutes };
  else
    return { hours, minutes, seconds };
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

/**
 * Returns the number of days in a given month and year.
 *
 * @param {number} year - The year (e.g., 2024).
 * @param {number} month - The month (0-based, where 0 = January, 11 = December).
 * @returns {number} The number of days in the specified month.
 */
export const daysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};