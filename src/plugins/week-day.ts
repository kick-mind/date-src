import { DateTime } from '../main';

/**
 * Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). 
 * @public
 */
export function weekDay(d: DateTime): number {
    return d.calendar.weekDay(d.ts);
}
