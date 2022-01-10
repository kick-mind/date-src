import { DateTime } from '../main';

/** Returns whether this DateTime is valid.
 * @public
 */
export function isValid(date: DateTime): boolean {
    const { year, month, day, hour, minute, second, ms } = date.toObject();
    return date.calendar.isValid(year, month, day) &&
        hour >= 0 &&
        hour < 24 &&
        minute >= 0 &&
        minute < 60 &&
        second >= 0 &&
        second < 60 &&
        ms >= 0 &&
        ms < 1000;
}
