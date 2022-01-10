// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
import {
  DateTimeUnits,
  MS_PER_DAY,
  DAYS_TO_MONTH_365,
  DAYS_TO_MONTH_366,
} from '../common';
import { Calendar, getTimeUnits } from '../main';

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

/**
 *  Gregorian calendar (Implemented by using JavaScript Date)
 */
export class GregorianCalendar extends Calendar {
  constructor(id: string) {
    super(id, 'gregory');
  }

  public addMonths(time: number, months: number): number {
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
    return Math.floor(diff / MS_PER_DAY);
  }

  daysInMonth(year: number, month: number): number {
    const days = this.isLeapYear(year) ? DAYS_TO_MONTH_366 : DAYS_TO_MONTH_365;
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
