import { DateTime } from '../main';

/**
 * Returns true if d1 is after d2 otherwise returns false.
 * @public
 */
export function isAfter(date1: DateTime, date2: DateTime): boolean {
    return date1.ts > date2.ts;
}
