// tslint:disable: variable-name
// tslint:disable: member-ordering
import { DateTimeUnits } from '../common';
// tslint:disable: triple-equals
const _jsEpoch = 62135596800000;
export const _ticksPerSecond = 1000;
export const _ticksPerMinute = _ticksPerSecond * 60;
export const _ticksPerHour = _ticksPerMinute * 60;
export const _ticksPerDay = _ticksPerHour * 24;
export const _maxYear = 9000;
const _maxMillis = 315537897600000;
const _minDate = new Date('100/1/1');
const _maxDate = new Date('9999/12/31');

export function throwErr() {
  throw new Error('Invalid Time!');
}
function add(time: number, value: number, scale: number): number {
  const millis: number = value * scale;
  if (!(millis > -Number(_maxMillis) && millis < Number(_maxMillis))) {
    throwErr();
  }
  const ticks: number = time + millis;
  checkAddResult(ticks, _minDate, _maxDate);
  return ticks;
}

function addMs(time: number, milliseconds: number): number {
  return add(time, milliseconds, 1);
}
function addSeconds(time: number, seconds: number): number {
  return add(time, seconds, _ticksPerSecond);
}
function addMinutes(time: number, minutes: number): number {
  return add(time, minutes, _ticksPerMinute);
}
function addHours(time: number, hours: number): number {
  return add(time, hours, _ticksPerHour);
}
function addDays(time: number, days: number): number {
  return add(time, days, _ticksPerDay);
}

export function checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
  if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
    throwErr();
  }
}

function getFirstDayWeekOfYear(
  firstDayOfWeek: number,
  dayOfYear: number,
  weekDay: number
): number {
  dayOfYear = dayOfYear - 1;
  const dayForJan1 = weekDay - (dayOfYear % 7);
  const offset = (dayForJan1 - firstDayOfWeek + 14) % 7;
  return Math.trunc((dayOfYear + offset) / 7) + 1;
}

export function getCalendarTicks(ticks: number): number {
  return ticks + _jsEpoch;
}

export function getJsTicks(ticks: number): number {
  return ticks - _jsEpoch;
}

/**
 * An base class for all calendars.
 * @public
 */
export abstract class Calendar {
  private _id: string;
  private _type: string;
  /**
   * Calendar's ID.
   */
  get id() {
    return this._id;
  }
  /**
   * Calendar's type (Gregorian, Chiness, Persian, Islamic, ...).
   * It is possible that you have multiple calendars with the same type and different ID's (multiple implementation for a specific calendar).
   */
  get type() {
    return this._type;
  }
  ms(time: number): number {
    return time % 1000;
  }
  second(time: number): number {
    return Math.trunc((time / _ticksPerSecond) % 60);
  }
  minute(time: number): number {
    return Math.trunc((time / _ticksPerMinute) % 60);
  }
  hour(time: number): number {
    return Math.trunc((time / _ticksPerHour) % 24);
  }

  private getWeekOfYearFullDays(
    time: number,
    firstDayOfWeek: number,
    fullDays: number
  ): number {
    let dayForJan1: number;
    let offset: number;
    let day: number;
    const dayOfYear = this.dayOfYear(time) - 1;
    dayForJan1 = this.weekDay(time) - (dayOfYear % 7);
    offset = (firstDayOfWeek - dayForJan1 + 14) % 7;
    if (offset != 0 && offset >= fullDays) {
      offset -= 7;
    }
    day = dayOfYear - offset;
    if (day >= 0) {
      return Math.trunc(day / 7) + 1;
    }
    return this.getWeekOfYearFullDays(
      addDays(time, -(dayOfYear + 1)),
      firstDayOfWeek,
      fullDays
    );
  }

  constructor(id: string, type: string) {
    this._id = id;
    this._type = type;
  }
  /** Get the week number of the week year (1 to 52). */
  weekNumber(time: number, firstDayOfWeek: number, offset: number): number {
    if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
      throwErr();
    }
    offset = offset % 8;
    if (offset == 1) {
      return getFirstDayWeekOfYear(
        firstDayOfWeek,
        this.dayOfYear(time),
        this.weekDay(time)
      );
    } else {
      return this.getWeekOfYearFullDays(time, firstDayOfWeek, offset);
    }
  }

  /** Adds a period of time to this DateTime and returns the resulting DateTime. */
  add(ts: number, units: Partial<DateTimeUnits>): number {
    const isInt = Number.isInteger;
    if (isInt(units.ms) && units.ms != 0) {
      ts = addMs(ts, units.ms);
    }

    if (isInt(units.second) && units.second != 0) {
      ts = addSeconds(ts, units.second);
    }

    if (isInt(units.minute) && units.minute != 0) {
      ts = addMinutes(ts, units.minute);
    }

    if (isInt(units.hour) && units.hour != 0) {
      ts = addHours(ts, units.hour);
    }

    if (isInt(units.day) && units.day != 0) {
      ts = addDays(ts, units.day);
    }

    if (isInt(units.month) && units.month != 0) {
      ts = this.addMonths(ts, units.month);
    }

    if (isInt(units.year) && units.year != 0) {
      ts = this.addYears(ts, units.year);
    }

    return ts;
  }

  /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
  subtract(ts: number, units: Partial<DateTimeUnits>): number {
    return this.add(ts, {
      year: -units.year,
      month: -units.month,
      day: -units.day,
      hour: -units.hour,
      minute: -units.minute,
      second: -units.second,
      ms: -units.ms,
    });
  }

  /** Returns whether this DateTime is valid. */
  isValid(year: number, month: number, day: number): boolean {
    return (
      year >= 1 &&
      year <= _maxYear &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= this.daysInMonth(year, month)
    );
  }

  /** Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). */
  weekDay(time: number): number {
    return Math.trunc(getCalendarTicks(time) / _ticksPerDay + 1) % 7;
  }

  protected timeToTicks(
    hour: number,
    minute: number,
    second: number,
    ms: number
  ): number {
    if (
      hour >= 0 &&
      hour < 24 &&
      minute >= 0 &&
      minute < 60 &&
      second >= 0 &&
      second < 60 &&
      ms >= 0 &&
      ms < _ticksPerSecond
    ) {
      return (
        hour * _ticksPerHour +
        minute * _ticksPerMinute +
        second * _ticksPerSecond +
        ms
      );
    }
    throwErr();
  }

  /** Returns the number of days in this DateTime's month. */
  abstract addMonths(time: number, months: number): number;
  /** */
  abstract addYears(time: number, years: number): number;
  /** Gets the day of the year (1 to 366). */
  abstract dayOfYear(time: number): number;
  /** Returns the number of days in this DateTime's month. */
  abstract daysInMonth(year: number, month: number): number;
  /** Returns the number of days in this DateTime's year. */
  abstract daysInYear(year: number): number;
  /** Returns true if this DateTime is in a leap year, false otherwise. */
  abstract isLeapYear(year: number): boolean;
  /** */
  abstract getTimestamp(units: DateTimeUnits): number;
  /** */
  abstract getDateUnits(ts: number): DateTimeUnits;

  getUnits(ts: number): DateTimeUnits {
    ts = getCalendarTicks(ts);
    const u = this.getDateUnits(ts);
    u.hour = this.hour(ts);
    u.minute = this.minute(ts);
    u.second = this.second(ts);
    u.ms = this.ms(ts);
    return u;
  }
}
