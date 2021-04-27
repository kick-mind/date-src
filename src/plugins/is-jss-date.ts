import { DateTime } from '../date-time';

/** Returns whether this DateTime is valid.
 * @public
 */
export function isJssDate(d: DateTime): boolean {
    return d instanceof DateTime;
}
