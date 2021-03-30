import {
  DateTimeUnits,
  getCalendarTimestamp,
  getJsTimestamp,
  msPerDay
} from 'src/common';
import { Calendar, getTimeUnits, throwErr } from '../calendar';

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

export class Hijri extends Calendar {
  constructor(private hijriAdjustment: number) {
    super('hijri', 'hijri');
  }
  addMonths(time: number, months: number): number {
    if (months < -120000 || months > 120000) {
      throwErr();
    }

    // Get the date in Hijri calendar.
    let ut = this.getUnits(time);
    let y = ut.year;
    let m = ut.month;
    let d = ut.day;

    let i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    let days = this.daysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      this.getAbsoluteDateHijri(y, m, d) * msPerDay +
      (getCalendarTimestamp(time) % msPerDay);
    //   Calendar.CheckAddResult(ticks, MinSupportedDateTime, MaxSupportedDateTime);
    return getJsTimestamp(ticks);
  }

  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }
  dayOfYear(time: number): number {
    let year;
    let numDays;

    // CheckTicksRange(ticks);

    numDays = Math.trunc(getCalendarTimestamp(time) / msPerDay) + 1;
    numDays += this.hijriAdjustment;
    year = Math.trunc(((numDays - 227013) * 30) / 10631) + 1;

    let daysToHijriYear = this.daysUpToHijriYear(year);
    let daysOfHijriYear = this.daysInYear(year);

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

    return Math.trunc(numDays);
  }
  daysInMonth(year: number, month: number): number {
    if (month == 12) {
      return this.isLeapYear(year) ? 30 : 29;
    }
    return month % 2 == 1 ? 30 : 29;
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 355 : 354;
  }
  isLeapYear(year: number): boolean {
    return (year * 11 + 14) % 30 < 11;
  }
  getTimestamp(units: DateTimeUnits): number {
    let daysInMonth = this.daysInMonth(units.year, units.month);
    if (units.day < 1 || units.day > daysInMonth) {
      throwErr();
    }

    let lDate = this.getAbsoluteDateHijri(units.year, units.month, units.day);

    if (lDate >= 0) {
      let ticks =
        lDate * msPerDay +
        this.timeToTicks(units.hour, units.minute, units.second, units.ms);
      return getJsTimestamp(ticks);
    } else {
      throwErr();
    }
  }
  getUnits(ts: number): DateTimeUnits {
    ts = getCalendarTimestamp(ts);
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
    let year;
    let month;
    let day;
    let numDays;

    // CheckTicksRange(ticks);

    numDays = Math.trunc(ticks / msPerDay) + 1;
    numDays += this.hijriAdjustment;
    year = Math.trunc(((numDays - 227013) * 30) / 10631) + 1;

    let daysToHijriYear = this.daysUpToHijriYear(year);
    let daysOfHijriYear = this.daysInYear(year);

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

    du.year = year;
    month = 1;
    numDays -= daysToHijriYear;

    while (month <= 12 && numDays > _hijriMonthDays[month - 1]) {
      month++;
    }
    month--;
    du.month = month;

    day = Math.trunc(numDays - _hijriMonthDays[month - 1]);
    du.day = day;
    return du;
  }

  private getAbsoluteDateHijri(y: number, m: number, d: number) {
    return Math.trunc(
      this.daysUpToHijriYear(y) +
        _hijriMonthDays[m - 1] +
        d -
        1 -
        this.hijriAdjustment
    );
  }
  private daysUpToHijriYear(year: number): number {
    let numDays;
    let numYear30;
    let numYearsLeft;

    numYear30 = Math.trunc(((year - 1) / 30) * 30);
    numYearsLeft = year - numYear30 - 1;
    numDays = Math.trunc((numYear30 * 10631) / 30) + 227013;
    while (numYearsLeft > 0) {
      numDays += 354 + (this.isLeapYear(numYearsLeft) ? 1 : 0);
      numYearsLeft--;
    }
    return numDays;
  }
}
