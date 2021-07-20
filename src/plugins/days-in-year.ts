import { DateTime } from '../main';

/**
 * Returns the number of days in this DateTime's year. 
 * @public
 */
export function daysInYear(d: DateTime): number {
    return d.calendar.daysInYear(d.year);
}
