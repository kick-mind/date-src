import { DateTime } from '../main/date-time';

/**
 * Gets the day of the year (1 to 366). 
 * @public 
 */
export function dayOfYear(d: DateTime): number {
    return d.calendar.dayOfYear(d.ts);
}




