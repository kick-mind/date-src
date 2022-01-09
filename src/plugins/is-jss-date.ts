import { DateTime } from '../main';

/** Returns whether the given object is a JS-Suger DateTime object.
 * @public
 */
export function isJssDate(x: any): boolean {
    return x instanceof DateTime;
}
