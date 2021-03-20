import { DateTime } from '../date';
import { Duration } from './duration';

export function diff(d1: DateTime, d2: DateTime): Duration {
    return new Duration(d1.toUtcTimestamp() - d2.toUtcTimestamp());
}
