import { DateTime } from '../main';

/**
 * Gets the ISO day of the week of the given DateTime object (Monday = 1, ..., Sunday = 7). 
 * @public
 * @param date DateTime
 */
export function weekDay(date: DateTime): number {
    return date.calendar.weekDay(date.ts + date.zone.getOffset(date.ts) * 1000 * 60);
}
