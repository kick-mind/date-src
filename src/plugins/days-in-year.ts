import { DateTimeUnits } from '../common';
import { DateTime, DateTimeCreateOptions } from '../date-time';

/**
 * Returns the number of days in this DateTime's year. 
 * @public
 */
 export function daysInYear(d: DateTime): number {
    return d.calendar.daysInYear(d.year);
}
