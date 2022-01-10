import { DateTime } from '../main';

/**
 * Returns the number of days in this DateTime's year. 
 * @public
 * @param date DateTime
 */
export function daysInYear(date: DateTime): number {
    return date.calendar.daysInYear(date.year);
}
