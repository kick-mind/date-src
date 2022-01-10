import { DateTime } from '../main';

/**
 * Returns whether this DateTime is same as another DateTime.
 * @public
 */
export function isSame(date1: DateTime, date2: DateTime): boolean {
    return date1.ts == date2.ts &&
        date1.calendar == date2.calendar &&
        date1.zone == date2.zone;
}
