import { DateTime } from '../main';
import { weekDay } from './week-day';
/**
 * @name setWeekDay
 * @category Plugins.
 * @summary Set the day of the week to the given date.
 * @description Set the day of the week to the given date.
 * @param {DateTime} date - date - the date to be changed
 * @param {dayOfWeek} number - day - the day of the week of the new date
 * @param {weekStartsOn} number - the index of the first day of the week
 * Sunday:0|Monday:1|Tuesday:2|Wednesday:3|Thursday:4|Friday:5|Saturday:6
 * js-sugar/date Month index is 1..12 
 * @returns {DateTime}  the new date with the day of the week set
 * @example
 * // Set week day to Sunday, with the default weekStartsOn of Sunday:
 * // js-sugar/date month index is 1..12 
 * const result = setDay(new Date(2022, 8, 1), 0)  
 * //=> Thu June 31 2022 00:00:00 (2022/7/31)
 *
 * @example
 * // Set week day to Sunday, with a weekStartsOn of Monday:
 * // js-sugar/date month index is 1..12 
 * const result = setDay(new Date(2014, 9, 1), 0, { weekStartsOn: 1 })
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
