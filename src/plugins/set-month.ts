import { DateTime } from '../main';
import { daysInMonth } from './days-in-month';

/**
 * @name setMonth
 * @category plugins
 * @summary Set the month to the given date.
 * @description 
 * @param {DateTime} date - the date to be changed
 * @param {Number} month - the month of the new date [1 to 12]
 * @returns {DateTime} the new date with the month set
 *
 * @example
 * setMonth(new DateTime(2018,7,31), 2) will be date of 2018-2-28
 */
export function setMonth(date: DateTime, month: number): DateTime {
  const day = Math.min(date.day, daysInMonth(new DateTime(date.year, month)));
  return new DateTime(
    date.year,
    month,
    day,
    date.hour,
    date.minute,
    date.second,
    date.ms
  );
}
