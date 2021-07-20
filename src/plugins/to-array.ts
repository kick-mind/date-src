import { DateTime } from '../main';

/** 
 * Returns an Array with the values of this DateTime. 
 * @public
 */
export function toArray(d: DateTime): number[] {
    const o = d.toObject();
    return [o.year, o.month, o.day, o.hour, o.minute, o.second, o.ms];
}
