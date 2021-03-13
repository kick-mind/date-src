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
  readonly _millisPerSecond = 1000;
  readonly _millisPerMinute = this._millisPerSecond * 60;
  readonly _millisPerHour = this._millisPerMinute * 60;
  readonly _millisPerDay = this._millisPerHour * 24;
  readonly _daysPerYear = 365;
  readonly _daysPer4Years = this._daysPerYear * 4 + 1;
  readonly _daysPer100Years = this._daysPer4Years * 25 - 1;
  readonly _daysPer400Years = this._daysPer100Years * 4 + 1;
  readonly _daysTo10000 = this._daysPer400Years * 25 - 366;
  readonly _maxMillis = this._daysTo10000 * this._millisPerDay;

  readonly _cal_GREGORIAN = 1;
  readonly _cal_PERSIAN = 22;

  m_currentEraValue = -1;

  static readonly _minSupportedDateTime = new Date('100/1/1');
  static readonly _maxSupportedDateTime = new Date('9999/12/31');

  readonly _id = -1;
  readonly _baseCalendarID = this._id;
  readonly _algorithmType = CalendarAlgorithmType.Unknown;

  get currentEraValue(): number {
    // The following code assumes that the current era value can not be -1.
    if (this.m_currentEraValue == -1) {
      this.m_currentEraValue = 1;
    }
    return this.m_currentEraValue;
  }

  static readonly _currentEra: number = 0;
  _twoDigitYearMax = -1;

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
  getDaysInMonth(year: number, month: number): number {
    return this.getDaysInMonth_era(year, month, Calendar._currentEra);
  }

  abstract getDaysInMonth_era(year: number, month: number, era: number): number;

  getDaysInYear(year: number): number {
    return this.getDaysInYear_era(year, Calendar._currentEra);
  }

  abstract getDaysInYear_era(year: number, era: number): number;

  // Returns the era for the specified DateTime value.
  abstract getEra(time: Date): number;

  abstract get eras(): number[];

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

  // Returns the number of months in the specified year in the current era.
  getMonthsInYear(year: number): number {
    return this.getMonthsInYear_era(year, Calendar._currentEra);
  }

  // Returns the number of months in the specified year and era.
  abstract getMonthsInYear_era(year: number, era: number): number;

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

  isLeapDay(year: number, month: number, day: number): boolean {
    return this.isLeapDay_era(year, month, day, Calendar._currentEra);
  }

  abstract isLeapDay_era(
    year: number,
    month: number,
    day: number,
    era: number
  ): boolean;

  isLeapMonth(year: number, month: number): boolean {
    return this.isLeapMonth_era(year, month, Calendar._currentEra);
  }

  abstract isLeapMonth_era(year: number, month: number, era: number): boolean;

  getLeapMonth(year: number): number {
    return this.getLeapMonth_era(year, Calendar._currentEra);
  }

  getLeapMonth_era(year: number, era: number): number {
    if (!this.isLeapYear_era(year, era)) {
      return 0;
    }

    const monthsCount = this.getMonthsInYear_era(year, era);
    for (let month = 1; month <= monthsCount; month++) {
      if (this.isLeapMonth_era(year, month, era)) {
        return month;
      }
    }

    return 0;
  }

  isLeapYear(year: number): boolean {
    return this.isLeapYear_era(year, Calendar._currentEra);
  }

  abstract isLeapYear_era(year: number, era: number): boolean;

  toDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ): Date {
    return this.toDateTime_era(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      Calendar._currentEra
    );
  }

  abstract toDateTime_era(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
    era: number
  ): Date;

  tryToDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
    era: number
  ): { result: boolean; date: Date } {
    let result = Calendar._minSupportedDateTime;
    let sucess: boolean;
    try {
      result = this.toDateTime_era(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        era
      );
      sucess = true;
    } catch (ArgumentException) {
      sucess = false;
    }

    return { result: sucess, date: result };
  }

  isValidYear_era(year: number): boolean {
    return (
      year >= this.getYear(Calendar._minSupportedDateTime) &&
      year <= this.getYear(Calendar._maxSupportedDateTime)
    );
  }

  isValidMonth_era(year: number, month: number, era: number): boolean {
    return (
      this.isValidYear_era(year) &&
      month >= 1 &&
      month <= this.getMonthsInYear_era(year, era)
    );
  }

  isValidDay_era(
    year: number,
    month: number,
    day: number,
    era: number
  ): boolean {
    return (
      this.isValidMonth_era(year, month, era) &&
      day >= 1 &&
      day <= this.getDaysInMonth_era(year, month, era)
    );
  }

  get getTwoDigitYearMax(): number {
    return this._twoDigitYearMax;
  }

  set setTwoDigitYearMax(twoDigitYearMax: number) {
    // VerifyWritable();
    this._twoDigitYearMax = twoDigitYearMax;
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

  toFourDigitYear(year: number): number {
    if (year < 0) {
      throw 'year:ArgumentOutOfRange_NeedNonNegNum';
    }

    if (year < 100) {
      return (
        (this.getTwoDigitYearMax / 100 -
          (year > this.getTwoDigitYearMax % 100 ? 1 : 0)) *
          100 +
        year
      );
    }
    return year;
  }

  private timeSpan_TimeToTicks(
    hour: number,
    minute: number,
    second: number
  ): number {
    // totalSeconds is bounded by 2^31 * 2^12 + 2^31 * 2^8 + 2^31,
    // which is less than 2^44, meaning we won't overflow totalSeconds.
    const totalSeconds = hour * 3600 + minute * 60 + second;
    if (totalSeconds > Number.MAX_VALUE || totalSeconds < Number.MIN_VALUE) {
      throw 'Overflow_TimeSpanTooLong';
    }
    return totalSeconds * Calendar._ticksPerSecond;
  }
}
