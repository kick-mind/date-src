import { DateTime } from '../main/date-time';

/**
 * Gets the number of days in the given DateTime's month. 
 * @public
 */
export function daysInMonth(d: DateTime): number {
    let u = d.toObject();
    return d.calendar.daysInMonth(u.year, u.month);
}
