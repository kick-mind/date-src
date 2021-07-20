import { DateTime } from '../main';

/**
 * Converts this object to a javascript Date
 * @public
 */
export function toJsDate(date: DateTime): Date {
    return new Date(date.ts);
}
