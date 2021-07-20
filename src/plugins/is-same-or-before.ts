import { DateTime } from '../main';

/**
 * Returns whether this DateTime is same or after another DateTime.
 * @public
 */
export function isSameOrBefore(d1: DateTime, d2: DateTime): boolean {
    return d1.ts <= d2.ts;
}
