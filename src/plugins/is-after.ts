import { DateTime } from '../date-time';

/**
 * Returns d1 is after d2.
 * @public
 */
export function isAfter(d1: DateTime, d2: DateTime): boolean {
    return d1.ts > d2.ts;
}
