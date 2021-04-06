// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
import {
  DateTimeUnits,
  getCalendarTimestamp,
  getJsTimestamp,
  MsPerDay,
  throwInvalidParam
} from '../../common';
import { Calendar, getTimeUnits, _maxYear } from '../calendar';
import { Calendars } from '../calendars';

// Number of days in a non-leap year
const DaysPerYear = 365;
// Number of days in 4 years
const DaysPer4Years = DaysPerYear * 4 + 1;
// Number of days in 100 years
const DaysPer100Years = DaysPer4Years * 25 - 1;
// Number of days in 400 years
const DaysPer400Years = DaysPer100Years * 4 + 1;
const DaysToMonth365 = [
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

const DaysToMonth366 = [
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
function isLeapYear(year: number): boolean {
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}
function getDateUnits(ticks: number): DateTimeUnits {
  const du: DateTimeUnits = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    ms: 0,
  };

  let n = Math.trunc(ticks / MsPerDay);
  const y400 = Math.trunc(n / DaysPer400Years);
  n -= y400 * DaysPer400Years;
  let y100 = Math.trunc(n / DaysPer100Years);
  if (y100 == 4) {
    y100 = 3;
  }
  n -= y100 * DaysPer100Years;
  const y4 = Math.trunc(n / DaysPer4Years);
  n -= y4 * DaysPer4Years;
  let y1 = Math.trunc(n / DaysPerYear);
  if (y1 == 4) {
    y1 = 3;
  }
  du.year = y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;
  n -= y1 * DaysPerYear;
  const leapYear: boolean = y1 == 3 && (y4 != 24 || y100 == 3);
  const days = leapYear ? DaysToMonth366 : DaysToMonth365;
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

function getAbsoluteDate(year: number, month: number, day: number): number {
  if (year >= 1 && year <= _maxYear && month >= 1 && month <= 12) {
    const days = isLeapYear(year) ? DaysToMonth366 : DaysToMonth365;
    if (day >= 1 && day <= days[month] - days[month - 1]) {
      const y = year - 1;
      const absoluteDate =
        y * 365 +
        Math.trunc(y / 4) -
        Math.trunc(y / 100) +
        Math.trunc(y / 400) +
        days[month - 1] +
        day -
        1;
      return absoluteDate;
    }
  }
  throwInvalidParam();
}

function dateToTicks(year: number, month: number, day: number): number {
  return getAbsoluteDate(year, month, day) * MsPerDay;
}

/** Gregorian2 calendar */
export class GregorianCalendar2 extends Calendar {
  constructor(id: string) {
    super(id, 'gregory');
  }

  addMonths(time: number, months: number): number {
    const ut = this.getUnits(time);
    let y = ut.year;
    let m = ut.month;
    let d = ut.day;

    const i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    const daysArray = this.isLeapYear(y) ? DaysToMonth366 : DaysToMonth365;
    const days = daysArray[m] - daysArray[m - 1];

    if (d > days) {
      d = days;
    }
    const ticks =
      dateToTicks(y, m, d) + (getCalendarTimestamp(time) % MsPerDay);
    return getJsTimestamp(ticks);
  }
  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }
  // check this method later
  dayOfYear(time: number): number {
    const now = new Date(time);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / MsPerDay);
  }
  daysInMonth(year: number, month: number): number {
    const days = this.isLeapYear(year) ? DaysToMonth366 : DaysToMonth365;
    return days[month] - days[month - 1];
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
  isLeapYear(year: number): boolean {
    return isLeapYear(year);
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
    ts = getCalendarTimestamp(ts);
    return { ...getDateUnits(ts), ...getTimeUnits(ts) };
  }
}

Calendars.add(new GregorianCalendar2('gregorian2'));

// declare var jss: any;
// if (jss) {
//   jss.Calendars.GregorianCalendar2 = GregorianCalendar2;
// }
