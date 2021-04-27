import { DateTime } from '../date-time';

/** Returns whether this DateTime is valid.
 * @public
 */
export function isValid(d: DateTime): boolean {
    const { year, month, day } = d.toObject();
    return d.calendar.isValid(year, month, day);
}
