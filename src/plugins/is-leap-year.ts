import { DateTime } from '../main';

/**
 * Returns true if this DateTime is in a leap year, false otherwise. 
 * @public
 */
export function isLeapYear(date: DateTime): boolean {
    return date.calendar.isLeapYear(date.year);
}
