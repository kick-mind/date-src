import { DateTime } from '../main';

/**
 * Returns whether d1 is before d2.
 * @public
 */
export function isBefore(d1: DateTime, d2: DateTime): boolean {
    return d1.ts < d2.ts;
}
