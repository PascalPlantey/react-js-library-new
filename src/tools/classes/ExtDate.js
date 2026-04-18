import axios from 'axios';
import { upperFirst } from '../misc';

/**------------------------------------------------------------------------------*
 * Consistency internal helpers
 *-------------------------------------------------------------------------------*/

const throwIfNotExtDate = date => {
  if (!(date instanceof ExtDate))
    throw new Error(`Expected an ExtDate instance, got ${date}`);
}

const throwIfInvalidDate = date => {
  if (isNaN(date.getTime()))
    throw new Error(`Invalid date: ${date}`);
}

const throwIfInvalidExtDate = date => {
  throwIfNotExtDate(date);
  throwIfInvalidDate(date);
}

/**------------------------------------------------------------------------------*
 * Internal helpers for calculations
 *-------------------------------------------------------------------------------*/

/**
 * Gets the ISO week number for a given date
 * 
 * @param {Date|ExtDate|string|number} date - The date for which to get the week number.
 * @returns {number} The ISO week number.
 */
function _getWeekNumber(date) {
  const when = new Date(date);

  // Day of the week (1 = Monday, 7 = Sunday)
  const dayNum = when.getUTCDay() || 7;

  // Move the date to the Thursday of the same week (ISO)
  when.setUTCDate(when.getUTCDate() + 4 - dayNum);

  // Start of the year
  const yearStart = new Date(Date.UTC(when.getUTCFullYear(), 0, 1));

  return Math.ceil((((when - yearStart) / 86400000) + 1) / 7);
}

/**
 * Calculates the difference between two dates in terms of years, months, days, hours, minutes and seconds
 * 
 * @param {ExtDate|Date|string|number} d1
 * @param {ExtDate|Date|string|number} d2 
 * @returns {Object} The difference between the two dates in years, months, days, hours, minutes and seconds.
 * Always positive and calculated from the earlier to the later date.
 */
function _getDatesDiff(d1, d2) {
  const start = new Date(d1);
  const end = new Date(d2);

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

  return { years, months, days, hours, minutes, seconds };
}

/**
 * Converts a duration object containing years, months and days into a human-readable string representation in French
 * 
 * @param {object} duration An object containing the duration in years, months and days 
 * @returns {string} A human-readable string representing the duration
 */
function _literalDuration({ years, months, days }) {
  const parts = [];

  if (years > 0)  parts.push(`${years} an${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mois`);
  if (days > 0)   parts.push(`${days} jour${days > 1 ? 's' : ''}`);

  if (parts.length === 0) return "aujourd'hui";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" et ");

  return parts.slice(0, -1).join(", ") + " et " + parts[parts.length - 1];
}

/**------------------------------------------------------------------------------*
 * Extension of the built-in Date class with additional utility methods for
 * easier date manipulation and formatting
 *-------------------------------------------------------------------------------*/
class ExtDate extends Date {
  /**
   * Creates an ExtDate instance from various input types.
   * The input can be an existing ExtDate, a native Date, a date string, or a timestamp.
   * 
   * @param {ExtDate|Date|string|number} [date] - The date to convert.
   * @param {Object} [options] - Options for date conversion.
   * @param {boolean} [options.forceNew=false] - Whether to always create a new ExtDate instance (defaults to false)
   * @param {boolean} [options.throwIfError=true] - Whether to throw an error for invalid dates.
   * @returns {ExtDate} The resulting ExtDate instance.
   */
  static from(date = new ExtDate(), { forceNew = false, throwIfError = true } = {}) {
    const validateAndSend = (d, throwIfError, forceNew) => {
      if (throwIfError) throwIfInvalidDate(d);
      return forceNew ? new ExtDate(d) : d;
    };

    if (date instanceof ExtDate)
      return validateAndSend(date, throwIfError, forceNew);
    else
      return validateAndSend(new ExtDate(date), throwIfError, false); // No need to copy a copy...
  }

  /**
   * Creates a copy of the current ExtDate instance. The copy is a new instance with the same date and time value;
   * used for immutability when chaining methods that modify the date
   *
   * @returns {ExtDate}
   */
  copy() {
    return ExtDate.from(this, { forceNew: true });
  }

  /**
   * Gets a string key in the format 'YYYY-MM-DD' for the date, useful for maps and comparisons
   * @returns {string} The date key in 'YYYY-MM-DD' format
   */
  get key() {
    const year = this.getFullYear();
    const month = String(this.getMonth() + 1).padStart(2, '0');
    const day = String(this.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Checks if the current date is a weekend (Saturday or Sunday)
   *
   * @returns {boolean} True if the date is a weekend, false otherwise
   */
  isWeekend() {
    const dayOfWeek = this.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }

  /**
   * Checks if the current date is the same as another date
   *
   * @param {ExtDate|Date|string|number} [otherDate=new ExtDate()] - The date to compare with
   * @returns {boolean} True if the dates are the same, false otherwise
   */
  isSameDay(otherDate) {
    const other = ExtDate.from(otherDate); // Convert to ExtDate if needed
    return this.key === other.key;
  }

  /**
   * Checks if the current date is today
   *
   * @returns {boolean} True if the date is today, false otherwise
   */
  isToday() {
    return this.isSameDay(new ExtDate());
  }

  /**
   * Moves the date to the current date and time
   * 
   * @returns {this}
   */
  toNow() {
    this.setTime(Date.now());
    return this;
  }

  /**
   * Gets the current date and time as an ExtDate instance
   * @static
   * @returns {ExtDate} The current date and time
   */
  static getNow() {
    return new ExtDate();
  }

  /**
   * Moves the date to the start of the day (00:00:00.000)
   *
   * @returns {this}
   */
  toStartOfDay() {
    this.setHours(0, 0, 0, 0);
    return this;
  }

  /**
   * Moves the date to the end of the day (23:59:59.999)
   *
   * @returns {this}
   */
  toEndOfDay() {
    this.setHours(23, 59, 59, 999);
    return this;
  }

  /**
   * Advances the date by the specified amounts of years, months, days, hours, minutes, and seconds.
   *
   * @param {Object} param The amounts to advance the date by
   * @param {number} [param.years=0] The number of years to advance
   * @param {number} [param.months=0] The number of months to advance
   * @param {number} [param.days=0] The number of days to advance
   * @param {number} [param.hours=0] The number of hours to advance
   * @param {number} [param.minutes=0] The number of minutes to advance
   * @param {number} [param.seconds=0] The number of seconds to advance
   * @returns {this} The updated date
   */
  advance({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = {}) {
    if (years)   this.setFullYear(this.getFullYear() + years);
    if (months)  this.setMonth(this.getMonth() + months);
    if (days)    this.setDate(this.getDate() + days);
    if (hours)   this.setHours(this.getHours() + hours);
    if (minutes) this.setMinutes(this.getMinutes() + minutes);
    if (seconds) this.setSeconds(this.getSeconds() + seconds);
    return this;
  }

  /**
   * Moves the date a given number of days back (negative value can be used to move forward)
   *
   * @param {number} days Number of days to move the date
   * @returns {this}
   */
  toDaysBefore(days = 1) {
    return this.advance({ days: -days });
  }

  /**
   * Moves the date a given number of days forward (negative value can be used to move back)
   * 
   * @param {number} days
   * @returns {this}
   */
  toDaysAfter(days = 1) {
    return this.toDaysBefore(-days);
  }

  /**
   * Moves the date to the previous day (same as toDaysBefore(1))
   * 
   * @returns {ExtDate}
   */
  toPreviousDay() {
    return this.toDaysBefore(1);
  }

  /**
   * Moves the date to the next day (same as toDaysAfter(1))
   * 
   * @returns {ExtDate}
   */
  toNextDay() {
    return this.toDaysAfter(1);
  }

  /**
   * Moves the date to the start of the next day (i.e. tomorrow at 00:00:00.000)
   * 
   * @returns {ExtDate}
   */
  toStartOfNextDay() {
    return this.toNextDay().toStartOfDay();
  }

  /**
   * Gets the start and end dates of the day for the current date as an array [startOfDay, endOfDay]
   * The start of the day is at 00:00:00.000 and the end of the day is next day at 00:00:00.000 (exclusive),
   * which allows for easy comparisons and range checks for the current day
   * 
   * @returns {Array<ExtDate>} An array containing the start and end dates of the day
   */
  getBoundaries() {
    return [this.copy().toStartOfDay(), this.copy().toStartOfNextDay()];
  }

  /**
   * Gets the ISO week number for the current date
   * @returns {number} The ISO week number
   */
  getWeekNumber() {
    return _getWeekNumber(this);
  }

  /**
   * Gets the number of days until the end of the month for the current date
   *
   * @returns {number} The number of days until the end of the month
   */
  getDaysUntilEndOfMonth() {
    return this.getMonthObject().lastDay.getDate() - this.getDate();
  }

  /**
   * Calculates the difference between the current date and another date in terms of years, months, days, hours,
   * minutes and seconds
   *
   * @param {ExtDate|Date|string|number} [otherDate=new ExtDate()] The date to compare with
   * @returns {Object} The difference between the two dates in years, months, days, hours, minutes and seconds.
   */
  getDifferenceFromDate(otherDate) {
    return _getDatesDiff(this, otherDate);
  }

  /**
   * Calculates the number of days between the current date and another date
   *
   * @param {ExtDate|Date|string|number} [otherDate=new ExtDate()] The date to compare with
   * @returns {number} The number of days between the two dates (always positive)
   */
  getDaysDifference(otherDate) {
    const other = ExtDate.from(otherDate);
    const diffTime = Math.abs(this - other);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Gets the Week object representing the week of the current date
   *
   * @returns {Week}
   */
  getWeekObject() {
    return new Week(this.getFullYear(), this.getWeekNumber());
  }

  /**
   * Gets the Month object representing the month of the current date
   *
   * @returns {Month}
   */
  getMonthObject() {
    return new Month(this.getFullYear(), this.getMonth() + 1);
  }

  toString({
    locale = 'fr-FR',
    options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
  } = {}) {
    return this.toLocaleString(locale, options);
  }

  toDateString({ locale = 'fr-FR', options = { year: 'numeric', month: '2-digit', day: '2-digit' }} = {}) {
    return this.toLocaleDateString(locale, options);
  }

  toTimeString({ locale = 'fr-FR', options = { hour: '2-digit', minute: '2-digit', second: '2-digit' }} = {}) {
    return this.toLocaleTimeString(locale, options);
  }

  get [Symbol.toStringTag]() {
    return 'ExtDate';
  }
};

/**------------------------------------------------------------------------------*
 * Range of dates with utility methods for easier manipulations / calculations
 * Keeps the start and end dates in sync. The end date is exclusive
 *-------------------------------------------------------------------------------*/
class DatesRange {
  #boundaries; // Whether the dates are normalized to the boundaries (start at 00:00:00.000 and end at next day 00:00:00.000)
  #startDate;
  #endDate;

  /**
   * Creates a new DatesRange instance
   *
   * @param {ExtDate|Date|string|number} [startDate=new ExtDate()] First date of the range (inclusive) 
   * @param {ExtDate|Date|string|number} [endDate=new ExtDate()] Last date of the range (inclusive by default, exclusive if endExcluded is true)
   * @param {Object} [options={}] Options for the date range
   * @param {boolean} [options.boundaries=true] Whether the dates are normalized to the boundaries
   * (start at 00:00:00.000 and end at next day 00:00:00.000)
   * @param {boolean} [options.endExcluded=false] Whether the end date is excluded from the range
   */
  constructor(startDate = new ExtDate(), endDate = new ExtDate(), options) {
    DatesRange.prototype.set.call(this, startDate, endDate, options);
  }

  /**
   * Updates the start and end dates of the range
   *
   * @param {ExtDate|Date|string|number} [startDate=new ExtDate()] First date of the range (inclusive) 
   * @param {ExtDate|Date|string|number} [endDate=new ExtDate()] Last date of the range (inclusive by default, exclusive if endExcluded is true)
   * @param {Object} [options={}] Options for the date range
   * @param {boolean} [options.boundaries=true] Whether the dates are normalized to the boundaries
   * (start at 00:00:00.000 and end at next day 00:00:00.000)
   * @param {boolean} [options.endExcluded=false] Whether the end date is excluded from the range
   * @return {DatesRange} The updated DatesRange instance (for chaining)
   */
  set(startDate = new ExtDate(), endDate = new ExtDate(), { boundaries = true, endExcluded = false } = {}) {
    this.#boundaries = boundaries;
    const start = ExtDate.from(startDate, { forceNew: true, throwIfError: true });
    const end = ExtDate.from(endDate, { forceNew: true, throwIfError: true });

    if (endExcluded)
      end.toPreviousDay(); // If end is exclusive, move it back by one day to make it inclusive for the internal representation
    if (boundaries) {
      start.toStartOfDay();
      end.toStartOfNextDay();
    }

    [this.#startDate, this.#endDate] = start > end ? [end, start] : [start, end];

    return this;
  }

  /**
   * Gets the start date of the range as a new ExtDate instance (immutable)
   * @returns {ExtDate} Start date of the range
   */
  get startDate() {
    return this.#startDate.copy();
  }

  /**
   * Gets the end date of the range as a new ExtDate instance (immutable)
   * @returns {ExtDate} End date of the range
   */
  get endDate() {
    return this.#endDate.copy();
  }

  /**
   * Gets the number of days in the range, including both start and end dates
   * @returns {number} Number of days in the range
   */
  get daysCount() {
    return this.#startDate.getDaysDifference(this.#endDate) + (this.#boundaries ? 0 : 1); // If boundaries are enabled, end date is exclusive, otherwise it is inclusive
  }

  /**
   * Checks if a given date is included in the range. The check is inclusive of the start date and exclusive of the
   * end date if boundaries are enabled, otherwise it is inclusive of both start and end dates
   * 
   * @param {ExtDate|Date|string|number} [date=new ExtDate()] Date to check
   * @returns {boolean}
   */
  includes(date) {
    const d = ExtDate.from(date); // Convert to ExtDate if needed

    if (this.#boundaries)
      return this.#startDate <= d && d < this.#endDate; // If boundaries are enabled, end date is exclusive

    return this.#startDate <= d && d <= this.#endDate;
  }

  /**
   * Sets the start date of the range, keeping the end date unchanged
   * @param {ExtDate|Date|string|number|undefined} [date=new ExtDate()] New start date
   * @returns {DatesRange} The updated DatesRange instance (for chaining)
   */
  setStartDate(date = new ExtDate()) {
    DatesRange.prototype.set.call(this, date, this.#endDate, { boundaries: this.#boundaries });
    return this;
  }

  /**
   * Sets the end date of the range, keeping the start date unchanged
   * @param {ExtDate|Date|string|number|undefined} [date=new ExtDate()] New end date
   * @return {DatesRange} The updated DatesRange instance (for chaining)
   */
  setEndDate(date = new ExtDate()) {
    DatesRange.prototype.set.call(this, this.#startDate, date, { boundaries: this.#boundaries });
    return this;
  }

  /**
   * Converts the date range to a string representation
   * @param {string} [locale='fr-FR'] Locale for date formatting
   * @returns {string} String representation of the date range
   */
  toString(locale = 'fr-FR') {
    return `DatesRange(from ${this.startDate.toDateString({ locale })} to ${this.endDate.toDateString({ locale })}, ${this.#boundaries ? 'end excluded' : 'end included'})`;
  }

  /**
   * Converts the date range to a literal duration string
   * @returns {string} A literal explanation of the difference eg. 3 ans 4 mois et 5 jours
   */
  toDurationString() {
    // If boundaries are enabled, end date is exclusive, so we move it back by one day for the duration calculation
    const end = this.#boundaries ? this.#endDate.copy().toPreviousDay() : this.#endDate;
    return _literalDuration(this.startDate.getDifferenceFromDate(end));
  }

  *[Symbol.iterator]() {
     // If boundaries are enabled, end date is exclusive, otherwise we need to include it in the iteration
    const end = this.#boundaries ? this.#endDate : this.#endDate.copy().toNextDay();

    for (let date = this.#startDate.copy(); date < end; date.toNextDay())
      yield date.copy();
  }

  get [Symbol.toStringTag]() {
      return 'DatesRange';
    }
};

/**------------------------------------------------------------------------------*
 * Week class representing a calendar week with utility methods
 *-------------------------------------------------------------------------------*/
class Week extends DatesRange {
  #year;
  #weekNumber;

  static #parseArgs(args) {
    if (args.length === 0)
      args = [new ExtDate()];

    if (args.length === 1) {
      const date = args[0] instanceof ExtDate ? args[0] : new ExtDate(args[0]);
      throwIfInvalidExtDate(date);
      return [date.getFullYear(), date.getWeekNumber()];
    }

    if (args.length === 2) {
      const [year, weekNumber] = args;
      if (typeof year !== 'number')
        throw new Error('Week constructor with 2 arguments requires year to be a number');

      if (typeof weekNumber === 'number' && (weekNumber >= 1 && weekNumber <= 52))
        return [year, weekNumber];

      return [year, ExtDate.from(weekNumber).getWeekNumber()]; // Try to parse weekNumber as a date to get the week number
    }

    throw new Error('Week constructor requires exactly 2 arguments (year: number, weekNumber: number)');
  }

  // ISO 8601: week 1 = week containing January 4th, starts on Monday
  static #getWeekBoundaries(year, weekNumber) {
    // Find January 4th of the given year, which is always in week 1
    const jan4 = new ExtDate(year, 0, 4);

    // Day of the week (1=Monday, 7=Sunday)
    const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay();

    // First Monday of the ISO year
    const firstMonday = new ExtDate(jan4);
    firstMonday.setDate(jan4.getDate() - (dayOfWeek - 1));

    // First day of the requested week
    const startDate = new ExtDate(firstMonday);
    startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

    // Last day (Sunday) of the requested week
    const endDate = new ExtDate(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return [startDate, endDate];
  }

  /**
   * Creates a new Week instance
   *
   * Can be called with either:
   * - () to create a Week instance for the current week
   * - (date: ExtDate|Date|string|number) to determine the week of the given date
   * - (year: number, weekNumber: number)
   */
  constructor(...args) {
    const [year, weekNumber] = Week.#parseArgs(args);
    const [startDate, endDate] = Week.#getWeekBoundaries(year, weekNumber);
    super(startDate, endDate);
    this.#year = year;
    this.#weekNumber = weekNumber;
  }

  /**
   * Updates the week based on the given arguments, which can be either:
   * - () to create a Week instance for the current week
   * - (date: ExtDate|Date|string|number) to determine the week of the given date
   * - (year: number, weekNumber: number)
   * @return {Week} The updated Week instance (for chaining)
   */
  set(...args) {
    const [year, weekNumber] = Week.#parseArgs(args);
    const [startDate, endDate] = Week.#getWeekBoundaries(year, weekNumber);
    DatesRange.prototype.set.call(this, startDate, endDate);
    this.#year = year;
    this.#weekNumber = weekNumber;

    return this;
  }

  /**
   * Gets the year of the week
   * @returns {number} Year of the week
   */
  get year() {
    return this.#year;
  }

  /**
   * Sets the year of the week, keeping the same week number (which may change the actual week if the new year has a different calendar)
   * @param {number} year New year for the week
   * @return {Week} The updated Week instance (for chaining)
   */
  setYear(year) {
    if (year != this.#year)
      Week.prototype.set.call(this, year, this.#weekNumber);
    return this;
  }

  /**
   * Gets the week number
   * @returns {number} Week number
   */
  get weekNumber() {
    return this.#weekNumber;
  }

  /**
   * Sets the week number, keeping the same year (which may change the actual week if the new week number has a different calendar)
   * @param {number} weekNumber New week number
   * @return {Week} The updated Week instance (for chaining)
   */
  setWeekNumber(weekNumber) {
    if (weekNumber != this.#weekNumber)
      Week.prototype.set.call(this, this.#year, weekNumber);
    return this;
  }

  /**
   * Gets the first day of the week
   * @returns {ExtDate} First day of the week
   */
  get firstDay() {
    return this.startDate;
  }

  /**
   * Gets the last day of the week
   * @returns {ExtDate} Last day of the week
   */
  get lastDay() {
    return this.endDate.toPreviousDay(); // End date is exclusive, so we move it back by one day to get the actual last day
  }

  toString(locale = 'fr-FR') {
    return `Week(${this.weekNumber} of ${this.year} - from ${this.firstDay.toDateString({ locale })} to ${this.lastDay.toDateString({ locale })})`;
  }

  get [Symbol.toStringTag]() {
    return 'Week';
  }
};

/**------------------------------------------------------------------------------*
 * Month class representing a calendar month with utility methods for easier 
 * manipulations / calculations
 *-------------------------------------------------------------------------------*/
class Month extends DatesRange {
  #year;
  #month;

  static #parseArgs(args) {
    if (!args.length)
      return [new ExtDate().getFullYear(), new ExtDate().getMonth() + 1];
    else if (args.length === 1) {
      const date = ExtDate.from(args[0]);
      return [date.getFullYear(), date.getMonth() + 1];
    }

    if (args.length === 2) {
      const [year, month] = args;

      if (typeof year !== 'number')
        throw new Error('Month constructor with 2 arguments requires year to be a number');

      if (typeof month === 'number' && (month >= 1 && month <= 12))
        return [year, month];

      return [year, ExtDate.from(month).getMonth() + 1]; // Try to parse month as a date
    }

    throw new Error('Month constructor accepts either a single Date argument or two arguments (year: number, month: number)');
  }

  /**
   * Creates a new Month instance
   * 
   * Can be called with either:
   * - () to create a Month instance for the current month
   * - (date: ExtDate|Date|string|number) to determine the month of the given date
   * - (year: number, month: number) to specify the month directly
   */
  constructor(...args) {
    const [year, month] = Month.#parseArgs(args);
    super(new ExtDate(year, month - 1, 1), new ExtDate(year, month, 0));
    this.#year = year;
    this.#month = month;
  }

  /**
   * Modifies the current Month instance
   *
   * Can be called with either:
   * - () to create a Month instance for the current month
   * - (date: ExtDate|Date|string|number) to determine the month of the given date
   * - (year: number, month: number) to specify the month directly
   */
  set(...args) {
    const [year, month] = Month.#parseArgs(args);
    DatesRange.prototype.set.call(this, new ExtDate(year, month - 1, 1), new ExtDate(year, month, 0));
    this.#year = year;
    this.#month = month;
    return this;
  }

  /**
   * Gets the year of the month
   * @returns {number} Year of the month
   */
  get year() {
    return this.#year;
  }

  /**
   * Sets the year of the month, keeping the same month
   *
   * @param {number} year New year for the month
   * @return {Month} The updated Month instance (for chaining)
   */
  set year(year) {
    Month.prototype.set.call(this, year, this.#month);
  }

  /**
   * Gets the month number (1-12)
   *
   * @returns {number} Month number (1-12)
   */
  get month() {
    return this.#month;
  }

  /**
   * Sets the month number (1-12), keeping the same year
   *
   * @param {number} month New month number (1-12)
   * @return {Month} The updated Month instance (for chaining)
   */
  set month(month) {
    Month.prototype.set.call(this, this.#year, month);
  }

  /**
   * Gets the first day of the month
   * @returns {ExtDate} First day of the month
   */
  get firstDay() {
    return this.startDate;
  }

  /**
   * Gets the last day of the month
   * @returns {ExtDate} Last day of the month
   */
  get lastDay() {
    return this.endDate.toPreviousDay();  // End date is exclusive, so we move it back by one day to get the actual last day
  }

  /**
   * Gets the number of days in the month
   * @returns {number} Number of days in the month
   */
  get daysCount() {
    return this.lastDay.getDate();
  }

  /**
   * Gets the number of weeks in the month
   * @returns {number} Number of weeks in the month
   */
  get weeksCount() {
    const firstWeek = this.firstDay.getWeekNumber();
    const lastWeek = this.lastDay.getWeekNumber();

    // Handle year transition (e.g. December with first week 49 and last week 5)
    return lastWeek >= firstWeek
            ? (lastWeek - firstWeek + 1)
            : (new Week(this.lastDay).getWeek().weekNumber + 1 - firstWeek);
  }

  toPreviousMonth() {
    return Month.prototype.set.call(this, this.firstDay.advance({ months: -1 }));
  }

  toNextMonth() {
    return Month.prototype.set.call(this, this.firstDay.advance({ months: 1 }));
  }

  /**
   * Gets the name of the month in the specified locale
   * 
   * @param {string} [locale='fr-FR'] Locale code (default: 'fr-FR')
   * @returns {string} Name of the month in the specified locale
   */
  getName(locale = 'fr-FR', uppercaseFirst = false) {
    const monthName = this.firstDay.toLocaleString(locale, { month: 'long' });
    return uppercaseFirst ? upperFirst(monthName) : monthName;
  }

  toString(locale = 'fr-FR') {
    return `Month(${this.getName(locale)} ${this.year} - from ${this.firstDay.toDateString({ locale })} to ${this.lastDay.toDateString({ locale })})`;
  }

  get [Symbol.toStringTag]() {
    return 'Month';
  }
};

/**------------------------------------------------------------------------------*
 * PublicHolidays class representing a collection of public holidays for a
 * specific year and country
 *-------------------------------------------------------------------------------*/
class PublicHolidays {
  #year;                      // Cannot be changed after creation as it requires the creation of a new PublicHolidays instance
  #holidays = [];             // Array of { date: ExtDate, localName: string, name: string, countryCode: string, fixed: boolean, global: boolean, counties: string[] | null }
  #holidaysMap = new Map();   // Map of date key (YYYY-MM-DD) to holiday info for quick lookup

  /**
   * Creates a new PublicHolidays instance for a given year and list of holidays (use `PublicHolidays.create(year, country)`
   * to fetch holidays from the API)
   * 
   * @param {number} year 
   * @param {Array<Object>} holidays 
   */
  constructor(year, holidays) {
    this.#year = year;
    // Convert the date strings 'YYYY-MM-DD' to ExtDate and store in both array and map for easy access
    this.#holidays = holidays.map(({ date, ...rest }) => {
      const extDate = new ExtDate(date);
      this.#holidaysMap.set(extDate.key, { date: extDate, ...rest });
      return { date: extDate, ...rest };
    });
  }

  /**
   * Creates a new PublicHolidays instance for a given year and country by fetching data from the API
   * 
   * @param {number|Date|ExtDate} [year=new ExtDate()] Year for which to fetch public holidays
   * (can be a number, a Date or an ExtDate; defaults to the current year)
   * @param {string} [country='FR'] ISO 3166-1 alpha-2 country code (default: 'FR' for France)
   * @returns {Promise<PublicHolidays>} A promise that resolves to a PublicHolidays instance
   */
  static async create(year = new ExtDate().getFullYear(), country = 'FR') {
    if (year instanceof Date || year instanceof ExtDate)
      year = year.getFullYear();
    if (typeof year !== 'number' || isNaN(year))
      throw new Error('Year must be a valid number');

    try {
      const { data } = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      // console.log(`Fetched ${data.length} public holidays for ${country} in ${year}`);
      return new PublicHolidays(year, data);
    } catch (error) {
      console.error('Error fetching public holidays:', error);
      return new PublicHolidays(year, []);
    }
  }

  /**
   * Gets the year for which the public holidays are defined
   * @returns {number} Year of the public holidays
   */
  get year() {
    return this.#year;
  }

  /**
   * Checks if a given date is a public holiday
   * @param {ExtDate} [date=new ExtDate()] Date to check (defaults to today)
   * @returns {boolean} True if the date is a public holiday, false otherwise
   */
  isHoliday(date) {
    const checkDate = ExtDate.from(date); // Convert to ExtDate if needed
    return this.#holidaysMap.has(checkDate.key);
  }

  /**
   * Gets the holiday information for a given date
   * @param {ExtDate} [date=new ExtDate()] Date to get holiday information for (defaults to today)
   * @returns {Object|undefined} Holiday information or undefined if not a holiday
   */
  getHoliday(date) {
    const checkDate = ExtDate.from(date); // Convert to ExtDate if needed
    return this.#holidaysMap.get(checkDate.key);
  }

  /**
   * Gets all holiday values
   * @returns {Array<Object>} Array of holiday information
   */
  values() {
    return Array.from(this.#holidays.map(({ date, ...rest }) => ({ date: date.copy(), ...rest })));
  }

  /**
   * Generates working days for a given week
   * 
   * @param {number|string|Date|ExtDate|Week} week Week for which to generate working days (can be a Week instance,
   * a Date/ExtDate/string (to determine the week) or a week number; defaults to the current week)
   * @returns {Generator<ExtDate>} Generator yielding working days
   */
  *workingDaysForWeek(week) {
    if (!(week instanceof Week))
      week = new Week(this.#year, week);

    for (const date of week)
      if (!date.isWeekend() && !this.isHoliday(date))
        yield date;
  }

  /**
   * Generates working days for a given month
   * @param {number|string|Date|ExtDate|Month} [month=new ExtDate().getMonth() + 1] Month for which to generate working days (0-11)
   * @returns {Generator<ExtDate>} Generator yielding working days
   */
  *workingDaysForMonth(month) {
    if (!(month instanceof Month))
      month = new Month(this.#year, month);

    for (const date of month)
      if (!date.isWeekend() && !this.isHoliday(date))
        yield date;
  }

  *[Symbol.iterator]() {
    for (const { date, ...rest } of this.#holidays)
      yield { date: date.copy(), ...rest };
  }

  toString() {
    return `PublicHolidays(year: ${this.#year}, holidays: ${[...this.#holidaysMap.values()].map(h => `${h.date.toString()}: ${h.localName}`).join(', ')})`;
  }

  get [Symbol.toStringTag]() {
    return 'PublicHolidays';
  }
};

export { ExtDate, DatesRange, Week, Month, PublicHolidays };