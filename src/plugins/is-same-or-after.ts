import { DateTime } from '../main';

/**
 * Returns whether this DateTime is same or after another DateTime.
 * @public
 */
export function isSameOrAfter(date1: DateTime, date2: DateTime): boolean {
    return date1.ts >= date2.ts;
}
