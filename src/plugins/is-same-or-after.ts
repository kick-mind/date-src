import { DateTime } from '../date-time';

/**
 * Returns whether this DateTime is same or after another DateTime.
 * @public
 */
export function isSameOrAfter(d1: DateTime, d2: DateTime): boolean {
    return d1.ts >= d2.ts;
}
