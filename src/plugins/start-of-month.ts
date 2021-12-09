import { DateTime } from '../main';

/**
 * @name startOfMonth
 * @category Plugins.
 * @summary Return the start of a month for the given date.
 * @description Return the start of a month for the given date.
 * @param {DateTime} date - the original date
 * @returns {DateTime} the start of a month
 * @example
 * // The start of a month for 2 October 2020 09:50:01:
 * const result = startOfMonth(new Date(2020, 10, 2, 09, 50, 1))
 * //=> Oct 01 2020 00:00:00
 */
export function startOfMonth(date: DateTime): DateTime {
  return new DateTime(date.year, date.month, 1);
}
