import { DateTime, Duration } from '../main';

/**
 * Return the difference between two DateTimes as a Duration.
 * @param date1 First DateTime
 * @param date2 Second DateTime
 */
export function diff(date1: DateTime, date2: DateTime): Duration {
    return new Duration(date1.ts - date2.ts);
}
