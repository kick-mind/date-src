import { DateTimeUnits } from '../date';

// tslint:disable-next-line: class-name
export interface Calendar__ {
  /** Get the year. */
  year(ts: number): number;

  /** Get the month (1-12). */
  month(ts: number): number;

  /** Get the day of the month (1 to 30). */
  day(ts: number): number;

  /** Get the hour of the day (0 to 23). */
  hour(ts: number): number;

  /** Get the minute of the hour (0 to 59). */
  minute(ts: number): number;

  /** Get the second of the minute (0 to 59). */
  second(ts: number): number;

  /** Get the millisecond of the second (0 to 999). */
  ms(ts: number): number;

  /** Adds a period of time to this DateTime and returns the resulting DateTime. */
  add(ts: number, amount: Partial<DateTimeUnits>): number;

  /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
  subtract(ts: number, amount: Partial<DateTimeUnits>): number;

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
  weeksInYear(ts: number): number;

  /** Returns true if this DateTime is in a leap year, false otherwise. */
  isInLeapYear(ts: number): boolean;

  /** Returns whether this DateTime is valid. */
  isValid(year: number, month: number, day: number): boolean;
}
