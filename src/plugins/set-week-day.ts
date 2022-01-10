import { DateTime } from '../main';
import { weekDay } from './week-day';
/**
 * @name setWeekDay
 * @category Plugins.
 * @summary Return the start of a week for the given date.
 * @description Return the start of a week for the given date.
 * @param {DateTime} date - the original date
 * @param {dayOfWeek} number - the day of week.
 * @param {weekStartsOn} number - the original date.
 * Sunday:0|Monday:1|Tuesday:2|Wednesday:3|Thursday:4|Friday:5|Saturday:6
 * @returns {DateTime} the start of a month
 * @example
 * // Set week day to Sunday, with the default weekStartsOn of Sunday:
 * var result = setDay(new Date(2014, 8, 1), 0)
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // Set week day to Sunday, with a weekStartsOn of Monday:
 * var result = setDay(new Date(2014, 8, 1), 0, { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 00:00:00
 */
export function setWeekDay(
  date: DateTime,
  dayOfWeek: number,
  weekStartsOn: number
): DateTime {
  const day = dayOfWeek;
  const currentDay = weekDay(date);

  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;

  const delta = 7 - weekStartsOn;
  const diff =
    day < 0 || day > 6
      ? day - ((currentDay + delta) % 7)
      : ((dayIndex + delta) % 7) - ((currentDay + delta) % 7);
  return date.add({ day: diff });
}
