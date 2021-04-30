import { DateTime } from '../date-time';

/**
 * Converts this object to a javascript Date
 * @public
 */
export function toJsDate(date: DateTime): Date {
    return new Date(date.ts);
}
