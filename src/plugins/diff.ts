
import { DateTime, Duration } from '../main';

/**
 * Return the difference between two DateTimes as a Duration.
 * @param d1 First DateTime
 * @param d2 Second DateTime
 */
export function diff(d1: DateTime, d2: DateTime): Duration {
    return new Duration(d1.ts - d2.ts);
}
