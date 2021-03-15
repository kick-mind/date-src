export enum CalendarAlgorithmType {
  Unknown = 0,
  SolarCalendar = 1,
  LunarCalendar = 2,
  LunisolarCalendar = 3,
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum CalendarWeekRule {
  FirstDay = 0,
  FirstFullWeek = 1,
  FirstFourDayWeek = 2,
}
// tslint:disable: member-ordering
// tslint:disable: triple-equals
// tslint:disable: variable-name
export abstract class Calendar {
  static readonly _ticksPerMillisecond = 1;
  static readonly _ticksPerSecond = Calendar._ticksPerMillisecond * 1000;
  static readonly _ticksPerMinute = Calendar._ticksPerSecond * 60;
  static readonly _ticksPerHour = Calendar._ticksPerMinute * 60;
  static readonly _ticksPerDay = Calendar._ticksPerHour * 24;
  private readonly _millisPerSecond = 1000;
  private readonly _millisPerMinute = this._millisPerSecond * 60;
  private readonly _millisPerHour = this._millisPerMinute * 60;
  private readonly _millisPerDay = this._millisPerHour * 24;
  private readonly _daysPerYear = 365;
  private readonly _daysPer4Years = this._daysPerYear * 4 + 1;
  private readonly _daysPer100Years = this._daysPer4Years * 25 - 1;
  private readonly _daysPer400Years = this._daysPer100Years * 4 + 1;
  private readonly _daysTo10000 = this._daysPer400Years * 25 - 366;
  private readonly _maxMillis = this._daysTo10000 * this._millisPerDay;

  protected readonly _cal_GREGORIAN = 1;
  protected readonly _cal_PERSIAN = 22;

  static readonly _minSupportedDateTime = new Date('100/1/1');
  static readonly _maxSupportedDateTime = new Date('9999/12/31');

  private readonly _algorithmType = CalendarAlgorithmType.Unknown;

  static checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
    if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
      throw 'Clanedar wrong range exception';
    }
  }

  add(time: Date, value: number, scale: number): Date {
    const millis: number = value * scale;
    if (
      !(millis > -Number(this._maxMillis) && millis < Number(this._maxMillis))
    ) {
      throw 'ArgumentOutOfRange_AddValue';
    }
    // ticks in milliseconds
    const ticks: number = time.getTime() + millis;
    Calendar.checkAddResult(
      ticks,
      Calendar._minSupportedDateTime,
      Calendar._maxSupportedDateTime
    );

    return new Date(ticks);
  }

  addMilliseconds(time: Date, milliseconds: number): Date {
    return this.add(time, milliseconds, 1);
  }

  addDays(time: Date, days: number): Date {
    return this.add(time, days, this._millisPerDay);
  }

  addHours(time: Date, hours: number): Date {
    return this.add(time, hours, this._millisPerHour);
  }

  addMinutes(time: Date, minutes: number): Date {
    return this.add(time, minutes, this._millisPerMinute);
  }

  abstract addMonths(time: Date, months: number): Date;

  addSeconds(time: Date, seconds: number): Date {
    return this.add(time, seconds, this._millisPerSecond);
  }

  addWeeks(time: Date, weeks: number): Date {
    return this.addDays(time, weeks * 7);
  }

  abstract addYears(time: Date, years: number): Date;
  abstract getDayOfMonth(time: Date): number;
  abstract getDayOfWeek(time: Date): DayOfWeek;
  abstract getDayOfYear(time: Date): number;
  abstract getDaysInMonth(year: number, month: number): number;
  abstract getDaysInYear(year: number): number;

  getHour(time: Date): number {
    return Math.trunc((time.getTime() / Calendar._ticksPerHour) % 24);
  }

  getMilliseconds(time: Date): number {
    return (time.getTime() / Calendar._ticksPerMillisecond) % 1000;
  }

  getMinute(time: Date): number {
    return Math.trunc((time.getTime() / Calendar._ticksPerMinute) % 60);
  }

  abstract getMonth(time: Date): number;
  abstract getMonthsInYear(year: number): number;

  getSecond(time: Date): number {
    return Math.trunc((time.getTime() / Calendar._ticksPerSecond) % 60);
  }

  getFirstDayWeekOfYear(time: Date, firstDayOfWeek: number): number {
    const dayOfYear = this.getDayOfYear(time) - 1;
    const dayForJan1 = this.getDayOfWeek(time) - (dayOfYear % 7);
    const offset = (dayForJan1 - firstDayOfWeek + 14) % 7;
    return (dayOfYear + offset) / 7 + 1;
  }

  private getWeekOfYearFullDays(
    time: Date,
    firstDayOfWeek: number,
    fullDays: number
  ): number {
    let dayForJan1: number;
    let offset: number;
    let day: number;

    const dayOfYear = this.getDayOfYear(time) - 1;

    dayForJan1 = this.getDayOfWeek(time) - (dayOfYear % 7);

    offset = (firstDayOfWeek - dayForJan1 + 14) % 7;

    if (offset != 0 && offset >= fullDays) {
      offset -= 7;
    }

    day = dayOfYear - offset;
    if (day >= 0) {
      return day / 7 + 1;
    }

    if (time <= this.addDays(Calendar._minSupportedDateTime, dayOfYear)) {
      return this.getWeekOfYearOfMinSupportedDateTime(firstDayOfWeek, fullDays);
    }
    return this.getWeekOfYearFullDays(
      this.addDays(time, -(dayOfYear + 1)),
      firstDayOfWeek,
      fullDays
    );
  }

  private getWeekOfYearOfMinSupportedDateTime(
    firstDayOfWeek: number,
    minimumDaysInFirstWeek: number
  ): number {
    const dayOfYear = this.getDayOfYear(Calendar._minSupportedDateTime) - 1;
    const dayOfWeekOfFirstOfYear =
      this.getDayOfWeek(Calendar._minSupportedDateTime) - (dayOfYear % 7);

    const offset = (firstDayOfWeek + 7 - dayOfWeekOfFirstOfYear) % 7;
    if (offset == 0 || offset >= minimumDaysInFirstWeek) {
      return 1;
    }

    const daysInYearBeforeMinSupportedYear =
      this.daysInYearBeforeMinSupportedYear - 1;
    const dayOfWeekOfFirstOfPreviousYear =
      dayOfWeekOfFirstOfYear - 1 - (daysInYearBeforeMinSupportedYear % 7);

    const daysInInitialPartialWeek =
      (firstDayOfWeek - dayOfWeekOfFirstOfPreviousYear + 14) % 7;
    let day = daysInYearBeforeMinSupportedYear - daysInInitialPartialWeek;
    if (daysInInitialPartialWeek >= minimumDaysInFirstWeek) {
      day += 7;
    }

    return day / 7 + 1;
  }

  protected get daysInYearBeforeMinSupportedYear(): number {
    return 365;
  }

  getWeekOfYear(
    time: Date,
    rule: CalendarWeekRule,
    firstDayOfWeek: DayOfWeek
  ): number {
    if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
      throw 'firstDayOfWeek: ArgumentOutOfRange_Range';
    }

    switch (rule) {
      case CalendarWeekRule.FirstDay:
        return this.getFirstDayWeekOfYear(time, firstDayOfWeek);
      case CalendarWeekRule.FirstFullWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 7);
      case CalendarWeekRule.FirstFourDayWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 4);
    }
    throw 'rule: ArgumentOutOfRange_Range';
  }

  abstract getYear(time: Date): number;
  abstract isLeapDay(year: number, month: number, day: number): boolean;
  abstract isLeapMonth(year: number, month: number): boolean;

  getLeapMonth(year: number): number {
    if (!this.isLeapYear(year)) {
      return 0;
    }

    const monthsCount = this.getMonthsInYear(year);
    for (let month = 1; month <= monthsCount; month++) {
      if (this.isLeapMonth(year, month)) {
        return month;
      }
    }

    return 0;
  }

  abstract isLeapYear(year: number): boolean;
  abstract toDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ): Date;

  isValidYear(year: number): boolean {
    return (
      year >= this.getYear(Calendar._minSupportedDateTime) &&
      year <= this.getYear(Calendar._maxSupportedDateTime)
    );
  }

  isValidMonth(year: number, month: number): boolean {
    return (
      this.isValidYear(year) &&
      month >= 1 &&
      month <= this.getMonthsInYear(year)
    );
  }

  isValidDay(year: number, month: number, day: number): boolean {
    return (
      this.isValidMonth(year, month) &&
      day >= 1 &&
      day <= this.getDaysInMonth(year, month)
    );
  }

  timeToTicks(
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ): number {
    if (
      hour >= 0 &&
      hour < 24 &&
      minute >= 0 &&
      minute < 60 &&
      second >= 0 &&
      second < 60
    ) {
      if (millisecond < 0 || millisecond >= this._millisPerSecond) {
        throw 'ArgumentOutOfRange_Range';
      }
      return (
        this.timeSpan_TimeToTicks(hour, minute, second) +
        millisecond * Calendar._ticksPerMillisecond
      );
    }
    throw 'ArgumentOutOfRange_BadHourMinuteSecond';
  }

  private timeSpan_TimeToTicks(
    hour: number,
    minute: number,
    second: number
  ): number {
    const totalSeconds = hour * 3600 + minute * 60 + second;
    if (totalSeconds > Number.MAX_VALUE || totalSeconds < Number.MIN_VALUE) {
      throw 'Overflow_TimeSpanTooLong';
    }
    return totalSeconds * Calendar._ticksPerSecond;
  }
}
