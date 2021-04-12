import { DateTime } from '../date-time';

/** Returns whether this DateTime is valid.
 * @public
 */
function isJssDate(d: DateTime): boolean {
    return d instanceof DateTime;
}
