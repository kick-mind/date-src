import { DateTime } from '../main';

/** 
 * Returns an Array with the values of this DateTime. 
 * @public
 */
export function toArray(date: DateTime): number[] {
    const o = date.toObject();
    return [o.year, o.month, o.day, o.hour, o.minute, o.second, o.ms];
}
