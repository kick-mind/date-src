
import { Calendar, CalendarAlgorithmType, DayOfWeek } from '../calendar';
import { CalHelper } from './cal-helper';

// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-const
export class PersianCalendar extends Calendar {
  static readonly _persianEra: number = 1;
  static readonly _tehranTimeTicks = 12600000;
  static _persianEpoch: number =
    19603728000000 / Calendar._ticksPerDay;
  static readonly _approximateHalfYear: number = 180;

  static readonly _datePartYear = 0;
  static readonly _datePartDayOfYear = 1;
  static readonly _datePartMonth = 2;
  static readonly _datePartDay = 3;
  static readonly _monthsPerYear = 12;

  static DaysToMonth = [
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

  static readonly _maxCalendarYear = 9378;
  static readonly _maxCalendarMonth = 10;
  static readonly _maxCalendarDay = 13;

  static minDate: Date = new Date('622/3/22');
  static maxDate: Date = new Date('9999/12/31');

  get MinSupportedDateTime(): Date {
    return PersianCalendar.minDate;
  }

  get MaxSupportedDateTime(): Date {
    return PersianCalendar.maxDate;
  }

  get algorithmType(): CalendarAlgorithmType {
    return CalendarAlgorithmType.SolarCalendar;
  }

  private get baseCalendarID(): number {
    return this._cal_GREGORIAN;
  }

  private get id(): number {
    return this._cal_PERSIAN;
  }
    /*=================================GetAbsoluteDatePersian==========================
    **Action: Gets the Absolute date for the given Persian date.  The absolute date means
    **       the number of days from January 1st, 1 A.D.
    ============================================================================*/
  private getAbsoluteDatePersian(
    year: number,
    month: number,
    day: number
  ): number {
    if (
      year >= 1 &&
      year <= PersianCalendar._maxCalendarYear &&
      month >= 1 &&
      month <= 12
    ) {
      const ordinalDay = PersianCalendar.daysInPreviousMonths(month) + day - 1;
      // day is one based, make 0 based since this will be the number of days we add to beginning of year below
      const approximateDaysFromEpochForYearStart = Math.trunc(
        CalHelper._meanTropicalYearInDays * (year - 1)
      );
      let yearStart = CalHelper.PersianNewYearOnOrBefore(
        PersianCalendar._persianEpoch +
          approximateDaysFromEpochForYearStart +
          PersianCalendar._approximateHalfYear
      );
      yearStart += ordinalDay;
      return yearStart;
    }
    throw 'ArgumentOutOfRange_BadYearMonthDay';
  }

  static checkTicksRange(ticks: number) {
    if (ticks < this.minDate.getTime() || ticks > this.maxDate.getTime()) {
      throw 'time ArgumentOutOfRange_CalendarRange';
    }
  }

  static checkEraRange(era: number) {
    if (era != this._currentEra && era != this._persianEra) {
      throw 'era ArgumentOutOfRange_InvalidEraValue';
    }
  }

  static checkYearRange(year: number, era: number) {
    this.checkEraRange(era);
    if (year < 1 || year > this._maxCalendarYear) {
      throw 'year ArgumentOutOfRange_Range';
    }
  }

  static checkYearMonthRange(year: number, month: number, era: number) {
    this.checkYearRange(year, era);
    if (year == this._maxCalendarYear) {
      if (month > this._maxCalendarMonth) {
        throw 'month ArgumentOutOfRange_Range';
      }
    }

    if (month < 1 || month > 12) {
      throw 'month ArgumentOutOfRange_Month';
    }
  }

  static monthFromOrdinalDay(ordinalDay: number): number {
    let index = 0;
    while (ordinalDay > this.DaysToMonth[index]) {
      index++;
    }

    return index;
  }

  static daysInPreviousMonths(month: number): number {
    --month; // months are one based but for calculations use 0 based
    return this.DaysToMonth[month];
  }

  private getDatePart(ticks: number, part: number): number {
    let NumDays; // The calculation buffer in number of days.
    PersianCalendar.checkTicksRange(ticks);

    NumDays = Math.trunc(ticks / Calendar._ticksPerDay) + 1;

    const yearStart = CalHelper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - PersianCalendar._persianEpoch) /
            CalHelper._meanTropicalYearInDays +
            0.5
        )
      ) + 1;

    if (part == PersianCalendar._datePartYear) {
      return y;
    }

    //  Calculate the Persian Month.
    const ordinalDay = Math.trunc(
      NumDays -
        CalHelper.getNumberOfDays(this.toDateTime_era(y, 1, 1, 0, 0, 0, 0, 1))
    );

    if (part == PersianCalendar._datePartDayOfYear) {
      return ordinalDay;
    }

    const m = PersianCalendar.monthFromOrdinalDay(ordinalDay);

    if (part == PersianCalendar._datePartMonth) {
      return m;
    }

    const d = ordinalDay - PersianCalendar.daysInPreviousMonths(m);

    if (part == PersianCalendar._datePartDay) {
      return d;
    }

    // Incorrect part value.
    throw 'InvalidOperation_DateTimeParsing';
  }

  addMonths(time: Date, months: number): Date {
    if (months < -120000 || months > 120000) {
      throw 'months ArgumentOutOfRange_Range';
    }
    // Get the date in Persian calendar.
    let timeTotalTicks = CalHelper.getTimeTicks(time);
    let y = this.getDatePart(timeTotalTicks, PersianCalendar._datePartYear);
    let m = this.getDatePart(timeTotalTicks, PersianCalendar._datePartMonth);
    let d = this.getDatePart(timeTotalTicks, PersianCalendar._datePartDay);
    const i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    const days = super.getDaysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      this.getAbsoluteDatePersian(y, m, d) * PersianCalendar._ticksPerDay +
      (timeTotalTicks % PersianCalendar._ticksPerDay);
    Calendar.checkAddResult(
      ticks,
      this.MinSupportedDateTime,
      this.MaxSupportedDateTime
    );
    return PersianCalendar.getDateFromTicks(ticks);
  }

  addYears(time: Date, years: number): Date {
    return this.addMonths(time, years * 12);
  }

  getDayOfMonth(time: Date): number {
    return this.getDatePart(
      CalHelper.getTimeTicks(time),
      PersianCalendar._datePartDay
    );
  }

  getDayOfWeek(time: Date): DayOfWeek {
    const day =
      Math.trunc(
        CalHelper.getTimeTicks(time) / PersianCalendar._ticksPerDay + 1
      ) % 7;
    return day as DayOfWeek;
  }

  getDayOfYear(time: Date): number {
    return this.getDatePart(
      CalHelper.getTimeTicks(time),
      PersianCalendar._datePartDayOfYear
    );
  }

  getDaysInMonth_era(year: number, month: number, era: number): number {
    PersianCalendar.checkYearMonthRange(year, month, era);

    if (
      month == PersianCalendar._maxCalendarMonth &&
      year == PersianCalendar._maxCalendarYear
    ) {
      return PersianCalendar._maxCalendarDay;
    }

    let daysInMonth =
      PersianCalendar.DaysToMonth[month] -
      PersianCalendar.DaysToMonth[month - 1];
    if (month == PersianCalendar._monthsPerYear && !super.isLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }

  getDaysInYear_era(year: number, era: number): number {
    PersianCalendar.checkYearRange(year, era);
    if (year == PersianCalendar._maxCalendarYear) {
      return (
        PersianCalendar.DaysToMonth[PersianCalendar._maxCalendarMonth - 1] +
        PersianCalendar._maxCalendarDay
      );
    }
    // Common years have 365 days.  Leap years have 366 days.
    return this.isLeapYear_era(year, PersianCalendar._currentEra) ? 366 : 365;
  }

  getEra(time: Date): number {
    PersianCalendar.checkTicksRange(CalHelper.getTimeTicks(time));
    return PersianCalendar._persianEra;
  }

  get eras(): number[] {
    return [PersianCalendar._persianEra];
  }

  getMonth(time: Date): number {
    return this.getDatePart(
      CalHelper.getTimeTicks(time),
      PersianCalendar._datePartMonth
    );
  }

  getMonthsInYear_era(year: number, era: number): number {
    PersianCalendar.checkYearRange(year, era);
    if (year == PersianCalendar._maxCalendarYear) {
      return PersianCalendar._maxCalendarMonth;
    }
    return 12;
  }

  getYear(time: Date): number {
    return this.getDatePart(
      CalHelper.getTimeTicks(time),
      PersianCalendar._datePartYear
    );
  }

  isLeapDay_era(
    year: number,
    month: number,
    day: number,
    era: number
  ): boolean {
    // The year/month/era value checking is done in GetDaysInMonth().
    const daysInMonth = this.getDaysInMonth_era(year, month, era);
    if (day < 1 || day > daysInMonth) {
      throw 'day ArgumentOutOfRange_Day';
    }
    return this.isLeapYear_era(year, era) && month == 12 && day == 30;
  }

  getLeapMonth_era(year: number, era: number): number {
    PersianCalendar.checkYearRange(year, era);
    return 0;
  }

  isLeapMonth_era(year: number, month: number, era: number): boolean {
    PersianCalendar.checkYearMonthRange(year, month, era);
    return false;
  }

  isLeapYear_era(year: number, era: number): boolean {
    PersianCalendar.checkYearRange(year, era);

    if (year == PersianCalendar._maxCalendarYear) {
      return false;
    }

    return (
      this.getAbsoluteDatePersian(year + 1, 1, 1) -
        this.getAbsoluteDatePersian(year, 1, 1) ==
      366
    );
  }

  toDateTime_era(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
    era: number
  ): Date {
    // The year/month/era checking is done in GetDaysInMonth().
    const daysInMonth = this.getDaysInMonth_era(year, month, era);
    if (day < 1 || day > daysInMonth) {
      throw 'ArgumentOutOfRange_Day';
    }

    const lDate = this.getAbsoluteDatePersian(year, month, day);

    if (lDate >= 0) {
      return new Date(
        lDate * Calendar._ticksPerDay +
          super.timeToTicks(hour, minute, second, millisecond)
      );
    } else {
      throw 'ArgumentOutOfRange_BadYearMonthDay';
    }
  }

  private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX = 1410;

  toFourDigitYear(year: number): number {
    if (year < 0) {
      throw 'yeaer ArgumentOutOfRange_NeedNonNegNum';
    }

    if (year < 100) {
      return super.toFourDigitYear(year);
    }

    if (year > PersianCalendar._maxCalendarYear) {
      throw 'year ArgumentOutOfRange_Range';
    }
    return year;
  }

  static getDateFromTicks(ticks: number): Date {
    return new Date(
      ticks + CalHelper.getTimeZoonOffSetFromTicks(ticks) - CalHelper._jsEpoch
    );
  }
}
