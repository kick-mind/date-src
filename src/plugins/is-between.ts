import { DateTime } from '../main';

/** 
 * Returns whether d is between d1 and d2.
 * @public
 */
export function isBetween(d: DateTime, d1: DateTime, d2: DateTime): boolean {
    return d.ts > d1.ts && d.ts < d2.ts;
}
