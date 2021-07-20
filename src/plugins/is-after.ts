import { DateTime } from '../main';

/**
 * Returns true if d1 is after d2 otherwise returns false.
 * @public
 */
export function isAfter(d1: DateTime, d2: DateTime): boolean {
    return d1.ts > d2.ts;
}
