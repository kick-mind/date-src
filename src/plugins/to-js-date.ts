import { DateTime } from '../main';

/**
 * Converts the given DateTime object to a javascript Date object.
 * @public
 * @param date DateTime
 */
export function toJsDate(date: DateTime): Date {
    return new Date(date.ts);
}
