import { DateTime } from '../main';
import { weekDayLocale } from '../plugins/week-day-locale';
import { weekDay } from './week-day';
/**
 * @name startOfWeek
 * @category Plugins.
 * @summary Return the start of a week for the given date.
 * @description Return the start of a week for the given date.
 * @param {DateTime} date - the original date
 * @param {weekStartsOn} number - the original date.
 * Sunday:0|Monday:1|Tuesday:2|Wednesday:3|Thursday:4|Friday:5|Saturday:6
 * @returns {DateTime} the start of a month
 * @example
 * // The start of a week for 2 October 2021 09:50:01:
 * const result = startOfWeek(new Date(2021, 10, 2, 09, 50, 1))
 * //=> Sep 26 2021 00:00:00
 */
export function startOfWeek(date: DateTime, weekStartsOn: number): DateTime {
  const day = weekDay(date);
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  return new DateTime(date.year, date.month, date.day).subtract({ day: diff });
}
