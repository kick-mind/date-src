import { DateTime } from '../date';
import { Duration } from './duration';

export function diff(d1: DateTime, d2: DateTime): Duration {
    return new Duration(d1.ts - d2.ts);
}
