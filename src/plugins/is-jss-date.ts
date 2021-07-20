import { DateTime } from '../main';

/** Returns whether this DateTime is valid.
 * @public
 */
export function isJssDate(d: DateTime): boolean {
    return d instanceof DateTime;
}
