// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
import { DateTimeUnits } from '../../common';
import {
  Calendar,
  getCalendarTicks,
  getJsTicks,
  getTimeUnits,
  throwErr,
  _maxYear,
  _ticksPerDay,
} from '../calendar';
import { Calendars } from '../calendars';

// Number of days in a non-leap year
const _daysPerYear = 365;
// Number of days in 4 years
const _daysPer4Years = _daysPerYear * 4 + 1;
// Number of days in 100 years
const _daysPer100Years = _daysPer4Years * 25 - 1;
// Number of days in 400 years
const _daysPer400Years = _daysPer100Years * 4 + 1;
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

const _daysToMonth366 = [
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

/** Gregorian2 calendar */
export class GregorianCalendar2 extends Calendar {

  constructor() {
    super('gregorian2', 'gregorian');
  }

  addMonths(time: number, months: number): number {
    if (months < -120000 || months > 120000) {
      throwErr();
    }

    const ut = this.getUnits(time);
    let y = ut.year;
    let m = ut.month;
    let d = ut.day;
    // int y, m, d;
    // this.GetDatePart(time.Ticks, out y, out m, out d);

    const i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    const daysArray = this.isLeapYear(y) ? _daysToMonth366 : _daysToMonth365;
    const days = daysArray[m] - daysArray[m - 1];

    if (d > days) {
      d = days;
    }
    const ticks = this.dateToTicks(y, m, d) + (getCalendarTicks(time) % _ticksPerDay);
    return getJsTicks(ticks);
  }
  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }
  // check this method later
  dayOfYear(time: number): number {
    const now = new Date(time);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / _ticksPerDay);
  }
  daysInMonth(year: number, month: number): number {
    const days = this.isLeapYear(year) ? _daysToMonth366 : _daysToMonth365;
    return days[month] - days[month - 1];
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
  isLeapYear(year: number): boolean {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
  }
  getTimestamp(units: DateTimeUnits): number {
    const u = units;
    return Date.UTC(u.year, u.month - 1, u.day, u.hour, u.minute, u.second, u.ms);
  }

  getUnits(ts: number): DateTimeUnits {
    ts = getCalendarTicks(ts);
    return { ...this.getDateUnits(ts), ...getTimeUnits(ts) };
  }

  private getDateUnits(ticks: number): DateTimeUnits {
    const du: DateTimeUnits = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    };

    let n = Math.trunc(ticks / _ticksPerDay);
    const y400 = Math.trunc(n / _daysPer400Years);
    n -= y400 * _daysPer400Years;
    let y100 = Math.trunc(n / _daysPer100Years);
    if (y100 == 4) {
      y100 = 3;
    }
    n -= y100 * _daysPer100Years;
    const y4 = Math.trunc(n / _daysPer4Years);
    n -= y4 * _daysPer4Years;
    let y1 = Math.trunc(n / _daysPerYear);
    if (y1 == 4) {
      y1 = 3;
    }
    du.year = y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;
    n -= y1 * _daysPerYear;
    const leapYear: boolean = y1 == 3 && (y4 != 24 || y100 == 3);
    const days = leapYear ? _daysToMonth366 : _daysToMonth365;
    // tslint:disable-next-line: no-bitwise
    let m = (n >> 5) + 1;
    // m = 1-based month number
    while (n >= days[m]) {
      m++;
    }
    du.month = m;
    du.day = n - days[m - 1] + 1;

    return du;
  }

  private getAbsoluteDate(year: number, month: number, day: number): number {
    if (year >= 1 && year <= _maxYear && month >= 1 && month <= 12) {
      const days = this.isLeapYear(year) ? _daysToMonth366 : _daysToMonth365;
      if (day >= 1 && day <= days[month] - days[month - 1]) {
        const y = year - 1;
        const absoluteDate = y * 365 + Math.trunc(y / 4) - Math.trunc(y / 100) + Math.trunc(y / 400) + days[month - 1] + day - 1;
        return absoluteDate;
      }
    }
    throwErr();
  }
  private dateToTicks(year: number, month: number, day: number): number {
    return this.getAbsoluteDate(year, month, day) * _ticksPerDay;
  }
}

Calendars.add(new GregorianCalendar2());
