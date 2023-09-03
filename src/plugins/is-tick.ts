import { DateTime } from '../main';

/** Returns whether the given object is a JS-Suger DateTime object.
 * @public
 */
export function isJssDate(o: any): boolean {
    return o instanceof DateTime;
}
