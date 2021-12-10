import { DateTime } from '../main';
import { daysInMonth } from './days-in-month';

/**
 * @name setDay
 * @category plugins
 * @summary Set the day to the given date.
 * @description
 * @param {DateTime} date - the date to be changed
 * @param {Number} day - the day of the new date
 * @returns {DateTime} the new date with the day set
 *
 * @example
 * setDay(new DateTime(2022,2,20), 28) will be date of 2022-2-28
 *
 */
export function setDay(date: DateTime, day: number): DateTime {
  const days = Math.min(day, daysInMonth(date));

  return new DateTime(
    date.year,
    date.month,
    days,
    date.hour,
    date.minute,
    date.second,
    date.ms
  );
}
