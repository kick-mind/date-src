import { Calendar, DateTimeUnits, DayOfWeek } from '../calendar';
import { Helper } from './helper';
// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-const

const _ticksPerSecond = 1000;
const _ticksPerMinute = _ticksPerSecond * 60;
const _ticksPerHour = _ticksPerMinute * 60;
const _ticksPerDay = _ticksPerHour * 24;

function checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
  if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
    throw new Error();
  }
}
export class Persia extends Calendar {
  private static _persianEpoch: number = 19603728000000 / _ticksPerDay;
  private static readonly _approximateHalfYear: number = 180;
  private static readonly _monthsPerYear = 12;
  private static readonly _maxCalendarYear = 9378;
  private static readonly _maxCalendarMonth = 10;
  private static readonly _maxCalendarDay = 13;
  static MinDate: Date = new Date('622/3/22');
  static MaxDate: Date = new Date('9999/12/31');
  private static DaysToMonth = [
    0,
    31,
    62,
    93,
    124,
    155,
    186,
    216,
    246,
    276,
    306,
    336,
    366,
  ];

  private getAbsoluteDatePersian(
    year: number,
    month: number,
    day: number
  ): number {
    if (
      year >= 1 &&
      year <= Persia._maxCalendarYear &&
      month >= 1 &&
      month <= 12
    ) {
      const ordinalDay = Persia.daysInPreviousMonths(month) + day - 1;
      const approximateDaysFromEpochForYearStart = Math.trunc(
        Helper._meanTropicalYearInDays * (year - 1)
      );
      let yearStart = Helper.PersianNewYearOnOrBefore(
        Persia._persianEpoch +
          approximateDaysFromEpochForYearStart +
          Persia._approximateHalfYear
      );
      yearStart += ordinalDay;
      return yearStart;
    }
    throw new Error();
  }

  private static monthFromOrdinalDay(ordinalDay: number): number {
    let index = 0;
    while (ordinalDay > this.DaysToMonth[index]) {
      index++;
    }

    return index;
  }

  private static daysInPreviousMonths(month: number): number {
    --month;
    return this.DaysToMonth[month];
  }

  private getDatePartDayOfYear(ticks: number): number {
    let NumDays = Math.trunc(ticks / _ticksPerDay) + 1;

    const yearStart = Helper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - Persia._persianEpoch) / Helper._meanTropicalYearInDays +
            0.5
        )
      ) + 1;

    const ordinalDay = Math.trunc(
      NumDays -
        Helper.getNumberOfDays(
          this.getTimestamp({
            year : y,
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0,
          })
        )
    );

    return ordinalDay;
  }


  addMonths(time: number, months: number): number {
    if (months < -120000 || months > 120000) {
      throw new Error();
    }
    let totalTicks = Helper.getPersiaTicks(time);
    let ut = this.getUnits(totalTicks);
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
      this.getAbsoluteDatePersian(y, m, d) * _ticksPerDay +
      (totalTicks % _ticksPerDay);
    checkAddResult(ticks, Persia.MinDate, Persia.MaxDate);
    return Helper.getJsTicks(ticks);
  }

  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }

  weekDay(time: number): DayOfWeek {
    const day = Math.trunc(Helper.getPersiaTicks(time) / _ticksPerDay + 1) % 7;
    return day as DayOfWeek;
  }

  dayOfYear(time: number): number {
    return this.getDatePartDayOfYear(Helper.getPersiaTicks(time));
  }

  daysInMonth(year: number, month: number): number {
    if (month == Persia._maxCalendarMonth && year == Persia._maxCalendarYear) {
      return Persia._maxCalendarDay;
    }

    let daysInMonth = Persia.DaysToMonth[month] - Persia.DaysToMonth[month - 1];
    if (month == Persia._monthsPerYear && !this.isInLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }

  daysInYear(year: number): number {
    if (year == Persia._maxCalendarYear) {
      return (
        Persia.DaysToMonth[Persia._maxCalendarMonth - 1] +
        Persia._maxCalendarDay
      );
    }
    return this.isInLeapYear(year) ? 366 : 365;
  }

  isInLeapYear(year: number): boolean {
    if (year == Persia._maxCalendarYear) {
      return false;
    }

    return (
      this.getAbsoluteDatePersian(year + 1, 1, 1) -
        this.getAbsoluteDatePersian(year, 1, 1) ==
      366
    );
  }

  isValid(year: number, month: number, day: number): boolean {
    return (
      year >= 1 &&
      year <= 9999 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= this.daysInMonth(year, month)
    );
  }

  private timeToTicks(
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
    throw new Error();
  }
  getTimestamp(units: DateTimeUnits): number {
    const daysInMonth = this.daysInMonth(units.year, units.month);
    if (units.day < 1 || units.day > daysInMonth) {
      throw new Error();
    }

    const lDate = this.getAbsoluteDatePersian(
      units.year,
      units.month,
      units.day
    );

    if (lDate >= 0) {
      let ticks =
        lDate * _ticksPerDay +
        this.timeToTicks(units.hour, units.minute, units.second, units.ms);
      return Helper.getJsTicks(ticks);
    } else {
      throw new Error();
    }
  }

  getUnits(ts: number): DateTimeUnits {
    let tu = this.getDateUnits(ts);
    tu.hour = this.hour(ts);
    tu.minute = this.minute(ts);
    tu.second = this.second(ts);
    tu.ms = this.ms(ts);
    return tu;
  }

  private getDateUnits(ticks: number): DateTimeUnits {
    let du: DateTimeUnits = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    };

    let NumDays;
    NumDays = Math.trunc(ticks / _ticksPerDay) + 1;
    const yearStart = Helper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - Persia._persianEpoch) / Helper._meanTropicalYearInDays +
            0.5
        )
      ) + 1;

    const ordinalDay = Math.trunc(
      NumDays -
        Helper.getNumberOfDays(
          this.getTimestamp({
            ['year']: y,
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0,
          })
        )
    );

    du.year = y;
    du.month = Persia.monthFromOrdinalDay(ordinalDay);
    du.day = ordinalDay - Persia.daysInPreviousMonths(du.month);

    return du;
  }
}
