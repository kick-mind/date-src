import { DateTime } from '../main';

/** 
 * Returns whether d is between d1 and d2.
 * @public
 */
export function isBetween(date: DateTime, date1: DateTime, date2: DateTime): boolean {
    return date.ts > date1.ts && date.ts < date2.ts;
}
