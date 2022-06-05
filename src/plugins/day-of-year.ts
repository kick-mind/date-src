import { DateTime } from '../main';

/**
 * Gets the day of the year (1 to 366). 
 * @public 
 * @param date DateTime
 */
export function dayOfYear(date: DateTime): number {
    return date.calendar.dayOfYear(date.ts);
}
