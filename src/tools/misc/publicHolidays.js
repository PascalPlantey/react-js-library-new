import axios from "axios";

/**
 * Retrieves public holidays for a given year and country code.
 *
 * @async
 * @function
 * @param {number} year - The year for which to fetch public holidays.
 * @param {string} [countryCode="FR"] - The ISO 3166 country code (default is "FR" for France).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of public holiday objects, each with an added `jsDate` property as a JavaScript Date instance.
 * @throws Will log an error to the console if the request fails.
 * 
 * @example
 * // Fetch public holidays for France in 2026
 * const holidays = await getPublicHolidays(2026, "FR");
 * console.log(holidays);
 * // Output:
 * // [
 * //   {
 * //     date: '2026-04-06', localName: 'Lundi de Pâques', name: 'Easter Monday', countryCode: 'FR', fixed: false,
 * //     global: true, jsDate: new Date('2026-04-06'), counties: null, launchYear: null, types: ['Public']
 * //   },
 * //   ...
 * // ]
 */
export const getPublicHolidays = async (year, countryCode = "FR") =>
  axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
       .then(({ data }) => {
        data?.forEach(element => element.jsDate = new Date(element.date));
        return data;
       })
       .catch(error => {
         console.error('Erreur lors de la récupération des jours fériés :', error);
       });

/**
 * Filters a list of holiday objects to return only those that occur in the specified month.
 *
 * @param {Array<{ jsDate: Date }>} holidays - An array of holiday objects, each containing a `jsDate` property.
 * @param {number} [month=new Date().getMonth()] - The zero-based month index (0 for January, 11 for December). Defaults to the current month.
 * @returns {Array<{ jsDate: Date }>} An array of holiday objects occurring in the specified month.
 */
export const publicHolidaysForMonth = (holidays, month = new Date().getMonth()) =>
  holidays.filter(holiday => holiday.jsDate.getMonth() === month);

/**
 * Returns an object containing the working days for a given month and year,
 * excluding weekends (Saturdays and Sundays) and specified public holidays.
 *
 * @param {Array<Object>} holidays - Array of holiday objects, each containing a `jsDate` property (Date instance).
 * @param {number} [month=new Date().getMonth()] - The month for which to calculate assignable days (0-indexed, 0 = January).
 * @returns {{ days: number[], month: number, year: number }} An object with:
 *   - days: Array of day numbers (1-indexed) that are assignable (not weekend or holiday).
 *   - month: The month number used (0-indexed).
 *   - year: The year used.
 */
export const workingDaysForMonth = (holidays, month = new Date().getMonth(), year = new Date().getFullYear()) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const holidaysForMonth = publicHolidaysForMonth(holidays, month);
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6; // Dimanche ou Samedi
    const isHoliday = holidaysForMonth.some(holiday =>
      holiday.jsDate.getFullYear() === year &&
      holiday.jsDate.getMonth() === month &&
      holiday.jsDate.getDate() === day
    );

    if (!isWeekend && !isHoliday)
      days.push(day);
  }

  return { days, month, year };
};