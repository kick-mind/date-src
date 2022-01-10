import { DateTime } from '../main';

/** 
 * Gets the day of the week with respect to the given DateTime's locale 
 * @public
 */
export function weekDayLocale(date: DateTime): number {
    return (date.locale.weekStart + date.calendar.weekDay(date.ts)) % 7;
}
