import { DateTime } from '../main';

/**
 * Get the week number of the week year of the given DateTime object(1 to 52).
 * @public
 */
export function weekNumber(date: DateTime): number {
  return date.calendar.weekNumber(date.ts + date.zone.getOffset(date.ts) * 1000 * 60, 1, 1);
}
