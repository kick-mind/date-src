import { DateTime } from '../main';

/** 
 * Get the day of the week with respect of this DateTime's locale (locale aware) 
 * @public
 */
export function weekDayLocale(d: DateTime): number {
    return (d.locale.weekStart + d.calendar.weekDay(d.ts)) % 7;
}
