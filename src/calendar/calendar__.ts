import { DateTimeUnits } from '../date';

// tslint:disable-next-line: class-name
export interface Calendar2 {
  /** Get the year. */
  getUnits(ts: number): DateTimeUnits;

  getTimestamp(units: DateTimeUnits): number;

  /** Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). */
  weekDay(ts: number): number;

  /** Gets the day of the year (1 to 366). */
  dayOfYear(ts: number): number;

  /** Get the week number of the week year (1 to 52). */
  weekNumber(ts: number): number;

  /** Returns the number of days in this DateTime's month. */
  daysInMonth(ts: number): number;

  /** Returns the number of days in this DateTime's year. */
  daysInYear(ts: number): number;

  /** Returns the number of weeks in this DateTime's year. */
  // weeksInYear(ts: number): number;

  /** Returns true if this DateTime is in a leap year, false otherwise. */
  isLeapYear(ts: number): boolean;

  /** Returns whether this DateTime is valid. */
  isValid(year: number, month: number, day: number): boolean;

  /** Adds a period of time to this DateTime and returns the resulting DateTime. */
  add(ts: number, units: Partial<DateTimeUnits>): number;

  /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
  subtract(ts: number, units: Partial<DateTimeUnits>): number;
}
