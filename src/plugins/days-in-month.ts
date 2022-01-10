import { DateTime } from '../main/date-time';

/**
 * Gets the number of days in the given DateTime's month. 
 * @public
 * @param date DateTime
 */
export function daysInMonth(date: DateTime): number {
    let u = date.toObject();
    return date.calendar.daysInMonth(u.year, u.month);
}
