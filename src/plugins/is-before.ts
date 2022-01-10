import { DateTime } from '../main';

/**
 * Returns whether d1 is before d2.
 * @public
 */
export function isBefore(date1: DateTime, date2: DateTime): boolean {
    return date1.ts < date2.ts;
}
