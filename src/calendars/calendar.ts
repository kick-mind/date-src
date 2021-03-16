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
  // tslint:disable: variable-name
// tslint:disable: member-ordering
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
  // Number of days in a non-leap year
  private readonly _daysPerYear = 365;
  // Number of days in 4 years
  private readonly _daysPer4Years = this._daysPerYear * 4 + 1;
  // Number of days in 100 years
  private readonly _daysPer100Years = this._daysPer4Years * 25 - 1;
  // Number of days in 400 years
  private readonly _daysPer400Years = this._daysPer100Years * 4 + 1;
  // Number of days from 1/1/0001 to 1/1/10000
  private readonly _daysTo10000 = this._daysPer400Years * 25 - 366;
  private readonly _maxMillis = this._daysTo10000 * this._millisPerDay;
  static readonly _minSupportedDateTime = new Date('100/1/1');
  static readonly _maxSupportedDateTime = new Date('9999/12/31');
  private readonly _algorithmType = CalendarAlgorithmType.Unknown;

  static checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
    if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
      throw new Error('Clanedar wrong range exception');
    }
  }

  add(time: Date, value: number, scale: number): Date {
    const millis: number = value * scale;
    if (
      !(millis > -Number(this._maxMillis) && millis < Number(this._maxMillis))
    ) {
      throw new Error('ArgumentOutOfRange_AddValue');
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

    const dayOfYear = this.getDayOfYear(time) - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.

    dayForJan1 = this.getDayOfWeek(time) - (dayOfYear % 7);

    // Now, calculate the offset.  Subtract the first day of week from the dayForJan1.  And make it a positive value.
    offset = (firstDayOfWeek - dayForJan1 + 14) % 7;
    // tslint:disable-next-line: triple-equals
    if (offset != 0 && offset >= fullDays) {
      offset -= 7;
    }
    //
    // Calculate the day of year for specified time by taking offset into account.
    //
    day = dayOfYear - offset;
    if (day >= 0) {
      return day / 7 + 1;
    }
    // Review
    if (time <= this.addDays(Calendar._minSupportedDateTime, dayOfYear)) {
      return this.getWeekOfYearOfMinSupportedDateTime(firstDayOfWeek, fullDays);
    }
    // Review
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
    const dayOfYear = this.getDayOfYear(Calendar._minSupportedDateTime) - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.
    const dayOfWeekOfFirstOfYear =
      this.getDayOfWeek(Calendar._minSupportedDateTime) - (dayOfYear % 7);

    // Calculate the offset (how many days from the start of the year to the start of the week)
    const offset = (firstDayOfWeek + 7 - dayOfWeekOfFirstOfYear) % 7;
    // tslint:disable-next-line: triple-equals
    if (offset == 0 || offset >= minimumDaysInFirstWeek) {
      // First of year falls in the first week of the year
      return 1;
    }

    const daysInYearBeforeMinSupportedYear =
      this.daysInYearBeforeMinSupportedYear - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.
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

  // it would be nice to make this abstract but we can't since that would break previous implementations
  protected get daysInYearBeforeMinSupportedYear(): number {
    return 365;
  }

  getWeekOfYear(
    time: Date,
    rule: CalendarWeekRule,
    firstDayOfWeek: DayOfWeek
  ): number {
    if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
      throw new Error('firstDayOfWeek: ArgumentOutOfRange_Range');
    }

    switch (rule) {
      case CalendarWeekRule.FirstDay:
        return this.getFirstDayWeekOfYear(time, firstDayOfWeek);
      case CalendarWeekRule.FirstFullWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 7);
      case CalendarWeekRule.FirstFourDayWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 4);
    }
    throw new Error('rule: ArgumentOutOfRange_Range');
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
        throw new Error('ArgumentOutOfRange_Range');
      }
      return (
        this.timeSpan_TimeToTicks(hour, minute, second) +
        millisecond * Calendar._ticksPerMillisecond
      );
    }
    throw new Error('ArgumentOutOfRange_BadHourMinuteSecond');
  }

  private timeSpan_TimeToTicks(
    hour: number,
    minute: number,
    second: number
  ): number {
    // totalSeconds is bounded by 2^31 * 2^12 + 2^31 * 2^8 + 2^31,
    // which is less than 2^44, meaning we won't overflow totalSeconds.
    const totalSeconds = hour * 3600 + minute * 60 + second;
    if (
      totalSeconds > Number.MAX_SAFE_INTEGER ||
      totalSeconds < Number.MIN_SAFE_INTEGER
    ) {
      throw new Error('Overflow_TimeSpanTooLong');
    }
    return totalSeconds * Calendar._ticksPerSecond;
  }
}
