import { DateTime } from '../main';

/**
 * Returns whether this DateTime is same as another DateTime.
 * @public
 */
export function isSame(d1: DateTime, d2: DateTime): boolean {
    return d1.ts == d2.ts &&
        d1.calendar == d2.calendar &&
        d1.zone == d2.zone;
}
