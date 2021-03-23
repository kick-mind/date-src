import { DateTimeUnits } from '../date';

// tslint:disable-next-line: class-name
export abstract class Calendar2 {
  /** Calendar's ID. */
  abstract get id(): string;

  /** Get the year. */
  abstract getUnits(ts: number): DateTimeUnits;

  abstract getTimestamp(units: DateTimeUnits): number;

  /** Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). */
  abstract weekDay(ts: number): number;

  /** Gets the day of the year (1 to 366). */
  abstract dayOfYear(ts: number): number;

  /** Get the week number of the week year (1 to 52). */
  abstract weekNumber(ts: number): number;

  /** Returns the number of days in this DateTime's month. */
  abstract daysInMonth(ts: number): number;

  /** Returns the number of days in this DateTime's year. */
  abstract daysInYear(ts: number): number;

  /** Returns the number of weeks in this DateTime's year. */
  // weeksInYear(ts: number): number;

  /** Returns true if this DateTime is in a leap year, false otherwise. */
  abstract isLeapYear(ts: number): boolean;

  /** Returns whether this DateTime is valid. */
  abstract isValid(year: number, month: number, day: number): boolean;

  /** Adds a period of time to this DateTime and returns the resulting DateTime. */
  abstract add(ts: number, units: Partial<DateTimeUnits>): number;

  /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
  abstract subtract(ts: number, units: Partial<DateTimeUnits>): number;
}
