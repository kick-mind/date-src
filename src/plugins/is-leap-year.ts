import { DateTime } from '../date-time';

/**
 * Returns true if this DateTime is in a leap year, false otherwise. 
 * @public
 */
export function isLeapYear(d: DateTime): boolean {
    return d.calendar.isLeapYear(d.year);
}
