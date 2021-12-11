import { DateTime } from '../main';
import { daysInMonth } from './days-in-month';

/**
 * @name setYear
 * @category plugins
 * @summary Set the year to the given date.
 * @description
 * @param {DateTime} date - the date to be changed
 * @param {Number} year - the year of the new date
 * @returns {DateTime} the new date with the year set
 *
 * @example
 * setYear(new DateTime(2004,2,29), 2003) will be date of 2003-2-28
 * because 2004 was a leap year.
 */
export function setYear(date: DateTime, year: number): DateTime {
  const day = Math.min(date.day, daysInMonth(date.clone({ year: year })));

  return new DateTime(
    year,
    date.month,
    day,
    date.hour,
    date.minute,
    date.second,
    date.ms
  );
}
