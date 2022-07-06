/**
 * @category Calendar
 * @module Calendar
 */

// tslint:disable: variable-name
// tslint:disable: member-ordering
import {
  DateTimeUnits,
  vType,
} from '../common';

/**
 * A base class for all calendars.
 * @public
 */
export abstract class Calendar {
  #id: string;
  #type: string;

  /**
   * Calendar's ID.
   */
  get id() {
    return this.#id;
  }

  /**
   * Calendar's type (Gregorian, Chiness, Persian, Islamic, ...).
   * It is possible that you have multiple calendars with the same type and different ID's (multiple implementations for a specific calendar).
   */
  get type() {
    return this.#type;
  }

  constructor(id: string, type: string) {
    vType(id, 'string', true);
    vType(type, 'string', true);
    this.#id = id;
    this.#type = type;
  }

  /** 
   * Adds a period of time to a timestamp and returns the resulting timestamp.
   * @public
   */
  abstract add(ts: number, units: Partial<DateTimeUnits>): number;

  /** 
   * Subtracts a period of time from a timestamp and returns the resulting timestamp.
   * @public
   */
  abstract subtract(ts: number, units: Partial<DateTimeUnits>): number;

  /** 
   * Returns true if the given date is valid, otherwise returns false.
   * @public
   * The month count starts with 1, up to 12.
   */
  abstract isValid(year: number, month: number, day: number): boolean;

  /**
   * Gets the ISO day of the week (Monday = 1, ..., Sunday = 7). 
   * @public
   */
  abstract weekDay(time: number): number;
  /** 
   * Gets the week number of the week year (1 to 52).
   * @public
   * @param ts timestamp
   */
  abstract weekNumber(ts: number, firstDayOfWeek: number, offset: number): number;
  /** 
   * Adds the specified number of months to the given timestamp and returns the resulting timestamp.
   * @param ts timestamp
   * @public
   */
  abstract addMonths(ts: number, months: number): number;

  /** 
   * Adds the specified number of years to the given timestamp and returns the resulting timestamp.
   * @public
   * @param ts timestamp
   */
  abstract addYears(ts: number, years: number): number;

  /** 
   * Gets the day of the year (1 to 366).
   * @public
   * @param ts timestamp
   */
  abstract dayOfYear(ts: number): number;

  /** 
   * Returns the number of days in the given year and month.
   * The month count starts with 1, up to 12.
   * @public
   */
  abstract daysInMonth(year: number, month: number): number;

  /** 
   * Returns the number of days in the given year.
   * @param year year
   */
  abstract daysInYear(year: number): number;

  /** 
   * Returns true if this DateTime is in a leap year, false otherwise. 
   * @public
   * @param year year
   */
  abstract isLeapYear(year: number): boolean;

  /** 
   * Returns a timestamp equivalent to the given DateTimeUnits 
   * @public
   * @param units DateTimeUnits
   */
  abstract getTimestamp(units: DateTimeUnits): number;

  /** 
   * Returns a DateTimeUnits(year, month, ...) equivalent to the given timestamp
   * @public
   * @param ts timestamp
   */
  abstract getUnits(ts: number): DateTimeUnits;
}
