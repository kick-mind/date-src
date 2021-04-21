import { DateTime } from '../date-time';

/**
 * Get the week number of the week year (1 to 52). 
 * @public
 */
export function weekNumber(d: DateTime): number {
    return d.calendar.weekNumber(this.ts, 1, 1);
}
