import { DateTime } from '../main';

/** 
 * Get the quarter. 
 * @public
 */
export function quarter(date: DateTime): number {
    return Math.floor(date.month / 4) + 1;
}
