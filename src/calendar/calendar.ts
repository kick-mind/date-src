export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
export interface DateTimeUnits {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
}
// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
const _ticksPerSecond = 1000;
const _ticksPerMinute = _ticksPerSecond * 60;
const _ticksPerHour = _ticksPerMinute * 60;
const _ticksPerDay = _ticksPerHour * 24;
const _maxMillis = 315537897600000;
const _minDate = new Date('100/1/1');
const _maxDate = new Date('9999/12/31');
const _daysInYear = 365;

function add(time: number, value: number, scale: number): number {
  const millis: number = value * scale;
  if (!(millis > -Number(_maxMillis) && millis < Number(_maxMillis))) {
    throw new Error();
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

function checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
  if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
    throw new Error();
  }
}

function getFirstDayWeekOfYear(
  time: number,
  firstDayOfWeek: number,
  dayOfYear: number,
  weekDay: number
): number {
  dayOfYear = dayOfYear - 1;
  const dayForJan1 = weekDay - (dayOfYear % 7);
  const offset = (dayForJan1 - firstDayOfWeek + 14) % 7;
  return Math.trunc((dayOfYear + offset) / 7) + 1;
}
export abstract class Calendar {
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

  weekNumber(time: number, firstDayOfWeek: DayOfWeek, offset: number): number {
    if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
      throw new Error();
    }
    offset = offset % 8;
    if (offset == 1) {
      return getFirstDayWeekOfYear(
        time,
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
    let t: number = ts;
    if (isInt(units.ms)) {
      t = addMs(t, units.ms);
    }

    if (isInt(units.second)) {
      t = addSeconds(t, units.second);
    }

    if (isInt(units.minute)) {
      t = addMinutes(t, units.minute);
    }

    if (isInt(units.hour)) {
      t = addHours(t, units.hour);
    }

    if (isInt(units.day)) {
      t = addDays(t, units.day);
    }

    if (isInt(units.month)) {
      t = this.addMonths(t, units.month);
    }

    if (isInt(units.year)) {
      t = this.addYears(t, units.year);
    }

    return t;
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

  abstract addMonths(time: number, months: number): number;
  abstract addYears(time: number, years: number): number;
  abstract weekDay(time: number): DayOfWeek;
  abstract dayOfYear(time: number): number;
  abstract daysInMonth(year: number, month: number): number;
  abstract daysInYear(year: number): number;
  abstract isInLeapYear(year: number): boolean;
  abstract isValid(year: number, month: number, day: number): boolean;
  abstract getTimestamp(units: DateTimeUnits): number;
  abstract getUnits(ts: number): DateTimeUnits;
}
