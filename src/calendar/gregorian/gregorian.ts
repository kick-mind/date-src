// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
import { DateTimeUnits, MsPerDay } from '../../common';
import { Calendar, getTimeUnits } from '../calendar';
const _monthsPerYear = 12;
const _daysToMonth365 = [
  0,
  31,
  59,
  90,
  120,
  151,
  181,
  212,
  243,
  273,
  304,
  334,
  365,
];

const _daysToMonth366 = [0, 31, 60, 91, 121, 152, 274, 305, 335, 366];

function getDateUnits(ts: number): DateTimeUnits {
  const d = new Date(ts);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: 0,
    minute: 0,
    second: 0,
    ms: 0,
  };
}
/** Gregorian calendar */
export class GregorianCalendar extends Calendar {
  constructor() {
    super('gregorian', 'gregory');
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
    return Math.floor(diff / MsPerDay);
  }
  daysInMonth(year: number, month: number): number {
    const days = this.isLeapYear(year) ? _daysToMonth366 : _daysToMonth365;
    return days[month] - days[month - 1];
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
  isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  getTimestamp(units: DateTimeUnits): number {
    const u = units;
    return Date.UTC(
      u.year,
      u.month - 1,
      u.day,
      u.hour,
      u.minute,
      u.second,
      u.ms
    );
  }

  getUnits(ts: number): DateTimeUnits {
    return { ...getDateUnits(ts), ...getTimeUnits(ts) };
  }

}
