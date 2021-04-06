import {
  DateTimeUnits,
  getCalendarTimestamp,
  getJsTimestamp,
  MsPerDay,
  throwInvalidParam,
  timeToTicks,
} from '../../common';
import { Calendar, getTimeUnits } from '../calendar';
import { Calendars } from "../calendars";

const _hijriMonthDays = [
  0,
  30,
  59,
  89,
  118,
  148,
  177,
  207,
  236,
  266,
  295,
  325,
  355,
];

function daysInYear(year: number): number {
  return isLeapYear(year) ? 355 : 354;
}
function isLeapYear(year: number): boolean {
  return (year * 11 + 14) % 30 < 11;
}

function daysUpToHijriYear(year: number): number {
  let numDays;
  let numYear30;
  let numYearsLeft;

  numYear30 = Math.trunc((year - 1) / 30) * 30;
  numYearsLeft = year - numYear30 - 1;
  numDays = Math.trunc((numYear30 * 10631) / 30) + 227013;
  while (numYearsLeft > 0) {
    numDays += 354 + (isLeapYear(numYearsLeft) ? 1 : 0);
    numYearsLeft--;
  }
  return numDays;
}

function getAbsoluteDateHijri(
  y: number,
  m: number,
  d: number,
  hijriAdjustment: number
) {
  return (
    daysUpToHijriYear(y) + _hijriMonthDays[m - 1] + d - 1 - hijriAdjustment
  );
}

function getDateUnits(ticks: number, hijriAdjustment: number): DateTimeUnits {
  const du: DateTimeUnits = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    ms: 0,
  };
  let year;
  let month;
  let day;
  let numDays;

  numDays = Math.trunc(ticks / MsPerDay) + 1;
  numDays += hijriAdjustment;
  year = Math.trunc(((numDays - 227013) * 30) / 10631) + 1;

  let daysToHijriYear = daysUpToHijriYear(year);
  const daysOfHijriYear = daysInYear(year);

  if (numDays < daysToHijriYear) {
    daysToHijriYear -= daysOfHijriYear;
    year--;
  } else if (numDays == daysToHijriYear) {
    year--;
    daysToHijriYear -= daysInYear(year);
  } else {
    if (numDays > daysToHijriYear + daysOfHijriYear) {
      daysToHijriYear += daysOfHijriYear;
      year++;
    }
  }

  du.year = year;
  month = 1;
  numDays -= daysToHijriYear;

  while (month <= 12 && numDays > _hijriMonthDays[month - 1]) {
    month++;
  }
  month--;
  du.month = month;

  day = numDays - _hijriMonthDays[month - 1];
  du.day = day;
  return du;
}
export class Hijri extends Calendar {
  constructor(private hijriAdjustment: number) {
    super('hijri', 'hijri');
  }
  addMonths(time: number, months: number): number {
    // Get the date in Hijri calendar.
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
    const days = this.daysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      getAbsoluteDateHijri(y, m, d, this.hijriAdjustment) * MsPerDay +
      (getCalendarTimestamp(time) % MsPerDay);

    return getJsTimestamp(ticks);
  }

  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }
  dayOfYear(time: number): number {
    let year;
    let numDays;

    numDays = Math.trunc(getCalendarTimestamp(time) / MsPerDay) + 1;
    numDays += this.hijriAdjustment;
    year = Math.trunc(((numDays - 227013) * 30) / 10631) + 1;

    let daysToHijriYear = daysUpToHijriYear(year);
    const daysOfHijriYear = this.daysInYear(year);

    if (numDays < daysToHijriYear) {
      daysToHijriYear -= daysOfHijriYear;
      year--;
    } else if (numDays == daysToHijriYear) {
      year--;
      daysToHijriYear -= this.daysInYear(year);
    } else {
      if (numDays > daysToHijriYear + daysOfHijriYear) {
        daysToHijriYear += daysOfHijriYear;
        year++;
      }
    }

    numDays -= daysToHijriYear;

    return numDays;
  }
  daysInMonth(year: number, month: number): number {
    if (month == 12) {
      return this.isLeapYear(year) ? 30 : 29;
    }
    return month % 2 == 1 ? 30 : 29;
  }
  daysInYear(year: number): number {
    return daysInYear(year);
  }
  isLeapYear(year: number): boolean {
    return isLeapYear(year);
  }
  getTimestamp(units: DateTimeUnits): number {
    const daysInMonth = this.daysInMonth(units.year, units.month);
    const lDate = getAbsoluteDateHijri(
      units.year,
      units.month,
      units.day,
      this.hijriAdjustment
    );

    if (lDate >= 0) {
      const ticks =
        lDate * MsPerDay +
        timeToTicks(units.hour, units.minute, units.second, units.ms);
      return getJsTimestamp(ticks);
    } else {
      throwInvalidParam();
    }
  }
  getUnits(ts: number): DateTimeUnits {
    ts = getCalendarTimestamp(ts);
    return { ...getDateUnits(ts, this.hijriAdjustment), ...getTimeUnits(ts) };
  }
}
declare var Jss_core: any;
Jss_core.Hijri  = Hijri;
Calendars.add(new Jss_core.Hijri());