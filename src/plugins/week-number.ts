import { DateTime } from '../date-time';

/**
 * Get the week number of the week year (1 to 52).
 * @public
 */
export function weekNumber(d: DateTime): number {
  return d.calendar.weekNumber(d.ts + d.zone.getOffset(d.ts) * 1000 * 60, 1, 1);
}
