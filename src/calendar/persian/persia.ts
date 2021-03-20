import { Calendar, DayOfWeek } from '../calendar';
import { Helper } from './helper';
// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-const
export class Persia extends Calendar {
  private static _persianEpoch: number =
    19603728000000 / Persia._ticksPerDay;
  private static readonly _approximateHalfYear: number = 180;

  private static readonly _datePartYear = 0;
  private static readonly _datePartDayOfYear = 1;
  private static readonly _datePartMonth = 2;
  private static readonly _datePartDay = 3;
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

  private getDatePart(ticks: number, part: number): number {
    let NumDays;
    NumDays = Math.trunc(ticks / Persia._ticksPerDay) + 1;
    const yearStart = Helper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - Persia._persianEpoch) /
            Helper._meanTropicalYearInDays +
            0.5
        )
      ) + 1;

    if (part == Persia._datePartYear) {
      return y;
    }

    const ordinalDay = Math.trunc(
      NumDays - Helper.getNumberOfDays(this.toDateTime(y, 1, 1, 0, 0, 0, 0))
    );

    if (part == Persia._datePartDayOfYear) {
      return ordinalDay;
    }

    const m = Persia.monthFromOrdinalDay(ordinalDay);
    if (part == Persia._datePartMonth) {
      return m;
    }

    const d = ordinalDay - Persia.daysInPreviousMonths(m);
    if (part == Persia._datePartDay) {
      return d;
    }
    throw new Error();
  }

  addMonths(time: number, months: number): number {
    if (months < -120000 || months > 120000) {
      throw new Error();
    }
    let timeTotalTicks = Helper.getPersiaTicks(time);
    let y = this.getDatePart(timeTotalTicks, Persia._datePartYear);
    let m = this.getDatePart(timeTotalTicks, Persia._datePartMonth);
    let d = this.getDatePart(timeTotalTicks, Persia._datePartDay);
    const i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    const days = this.getDaysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      this.getAbsoluteDatePersian(y, m, d) * Persia._ticksPerDay +
      (timeTotalTicks % Persia._ticksPerDay);
    Persia.checkAddResult(
      ticks,
      Persia.MinDate,
      Persia.MaxDate
    );
    return Helper.getJsTicks(ticks);
  }

  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }

  getDayOfMonth(time: number): number {
    return this.getDatePart(
      Helper.getPersiaTicks(time),
      Persia._datePartDay
    );
  }

  getDayOfWeek(time: number): DayOfWeek {
    const day =
      Math.trunc(
        Helper.getPersiaTicks(time) / Persia._ticksPerDay + 1
      ) % 7;
    return day as DayOfWeek;
  }

  getDayOfYear(time: number): number {
    return this.getDatePart(
      Helper.getPersiaTicks(time),
      Persia._datePartDayOfYear
    );
  }

  getDaysInMonth(year: number, month: number): number {
    if (
      month == Persia._maxCalendarMonth &&
      year == Persia._maxCalendarYear
    ) {
      return Persia._maxCalendarDay;
    }

    let daysInMonth =
      Persia.DaysToMonth[month] -
      Persia.DaysToMonth[month - 1];
    if (month == Persia._monthsPerYear && !this.isLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }

  getDaysInYear(year: number): number {
    if (year == Persia._maxCalendarYear) {
      return (
        Persia.DaysToMonth[Persia._maxCalendarMonth - 1] +
        Persia._maxCalendarDay
      );
    }
    return this.isLeapYear(year) ? 366 : 365;
  }

  getMonth(time: number): number {
    return this.getDatePart(
      Helper.getPersiaTicks(time),
      Persia._datePartMonth
    );
  }

  getYear(time: number): number {
    return this.getDatePart(
      Helper.getPersiaTicks(time),
      Persia._datePartYear
    );
  }

  isLeapYear(year: number): boolean {
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
      year >= this.getYear(Persia.MinDate.getTime()) &&
      year <= this.getYear(Persia.MaxDate.getTime()) &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= this.getDaysInMonth(year, month)
    );
  }

  toDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    ms: number
  ): number {
    const daysInMonth = this.getDaysInMonth(year, month);
    if (day < 1 || day > daysInMonth) {
      throw new Error();
    }

    const lDate = this.getAbsoluteDatePersian(year, month, day);

    if (lDate >= 0) {
      let ticks =
        lDate * Persia._ticksPerDay +
        this.timeToTicks(hour, minute, second, ms);
      return Helper.getJsTicks(ticks);
    } else {
      throw new Error();
    }
  }
}
