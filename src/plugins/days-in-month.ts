import { DateTime } from '../main/date-time';

/**
 * Returns the number of days in this DateTime's month. 
 * @public
 */
export function daysInMonth(d: DateTime): number {
    let u = d.toObject();
    return d.calendar.daysInMonth(u.year, u.month);
}
