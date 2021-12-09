import { DateTime } from '../main';

/**
 * @name startOfMonth
 * @category Plugins.
 * @summary Return the start of a month for the given date.
 * @description Return the start of a month for the given date.
 * @param {DateTime} date - the original date
 * @returns {DateTime} the start of a month
 * @example
 * // The start of a month for 9 December 2021 09:50:01:
 * const result = endOfMonth(new Date(2021, 12, 9, 09, 50, 1))
 * //=> Oct 31 2021 00:00:00
 */
export function endOfMonth(date: DateTime): DateTime {
  return new DateTime(
    date.year,
    date.month,
    date.calendar.daysInMonth(date.year, date.month)
  );
}
