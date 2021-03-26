// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals

import { DateTimeUnits } from '../../common';
import { Calendar, _ticksPerDay } from '../calendar';
const _monthsPerYear = 12;
const _maxYear = 9000;
const _DaysToMonth = [
  0,
  31,
  60,
  91,
  121,
  152,
  182,
  213,
  244,
  274,
  305,
  335,
  366,
];

export class Gregorian extends Calendar {
  constructor() {
    super('gregorian', 'gregorian');
  }

  addMonths(time: number, months: number): number {
    const d = new Date(time);
    d.setMonth(d.getMonth() + months);
    return d.getTime();
  }
  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }

  dayOfYear(time: number): number {
    const now = new Date(time);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / _ticksPerDay);
  }
  daysInMonth(year: number, month: number): number {
    let daysInMonth = _DaysToMonth[month] - _DaysToMonth[month - 1];
    if (month == _monthsPerYear && !this.isLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
  isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  getTimestamp(units: DateTimeUnits): number {
    const u = units;
    return Date.UTC(u.year, u.month, u.day, u.hour, u.month, u.second, u.ms);
  }
  getUnits(ts: number): DateTimeUnits {
    const d = new Date(ts);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds(),
      ms: d.getUTCMilliseconds(),
    };
  }
}
