import { DateTime } from '../main';

/**
 * Gets the number of days in this DateTime's year. 
 * @public
 * @param date DateTime
 */
export function daysInYear(date: DateTime): number {
    return date.calendar.daysInYear(date.year);
}
