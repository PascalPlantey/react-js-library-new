/**
 * Returns the ISO week number for a given date.
 *
 * The ISO week starts on Monday and the first week of the year is the one that contains the first Thursday.
 *
 * @param {Date} [date=new Date()] - The date for which to get the week number. Defaults to the current date if not provided.
 * @returns {number} The ISO week number (1-53).
 */
export const getWeekNumber = (date = new Date()) => {
  // Jour de la semaine (1 = lundi, 7 = dimanche)
  const dayNum = date.getUTCDay() || 7;

  // On place la date au jeudi de la même semaine (ISO)
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);

  // Début de l'année
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};
