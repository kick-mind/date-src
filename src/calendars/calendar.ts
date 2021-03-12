
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
export abstract class Calendar {
  // Number of 100ns (10E-7 second) ticks per time unit
  static get _ticksPerMillisecond(): number {
    return 1;
  }
  // private get TicksPerMillisecond() :number {return 10000}
  static get _ticksPerSecond(): number {
    return this._ticksPerMillisecond * 1000;
  }
  static get _ticksPerMinute(): number {
    return this._ticksPerSecond * 60;
  }
  static get _ticksPerHour(): number {
    return this._ticksPerMinute * 60;
  }
  static get _ticksPerDay(): number {
    return this._ticksPerHour * 24;
  }

  // Number of milliseconds per time unit
  get _millisPerSecond(): number {
    return 1000;
  }
  get _millisPerMinute(): number {
    return this._millisPerSecond * 60;
  }
  get _millisPerHour(): number {
    return this._millisPerMinute * 60;
  }
  get _millisPerDay(): number {
    return this._millisPerHour * 24;
  }

  // Number of days in a non-leap year
  get _daysPerYear(): number {
    return 365;
  }
  // Number of days in 4 years
  get _daysPer4Years(): number {
    return this._daysPerYear * 4 + 1;
  }
  // Number of days in 100 years
  get _daysPer100Years(): number {
    return this._daysPer4Years * 25 - 1;
  }
  // Number of days in 400 years
  get _daysPer400Years(): number {
    return this._daysPer100Years * 4 + 1;
  }

  // Number of days from 1/1/0001 to 1/1/10000
  get _daysTo10000(): number {
    return this._daysPer400Years * 25 - 366;
  }

  get _maxMillis(): number {
    return this._daysTo10000 * this._millisPerDay;
  }

  get _cal_GREGORIAN(): number {
    return 1;
  } // Gregorian (localized) calendar
  get _cal_GREGORIAN_US(): number {
    return 2;
  } // Gregorian (U.S.) calendar
  get _cal_JAPAN(): number {
    return 3;
  } // Japanese Emperor Era calendar
  get _cal_TAIWAN(): number {
    return 4;
  } // Taiwan Era calendar
  get _cal_KOREA(): number {
    return 5;
  } // Korean Tangun Era calendar
  get _cal_HIJRI(): number {
    return 6;
  } // Hijri (Arabic Lunar) calendar
  get _cal_THAI(): number {
    return 7;
  } // Thai calendar
  get _cal_HEBREW(): number {
    return 8;
  } // Hebrew (Lunar) calendar
  get _cal_GREGORIAN_ME_FRENCH(): number {
    return 9;
  } // Gregorian Middle East French calendar
  get _cal_GREGORIAN_ARABIC(): number {
    return 10;
  } // Gregorian Arabic calendar
  get _cal_GREGORIAN_XLIT_ENGLISH(): number {
    return 11;
  } // Gregorian Transliterated English calendar
  get _cal_GREGORIAN_XLIT_FRENCH(): number {
    return 12;
  }
  get _cal_JULIAN(): number {
    return 13;
  }
  get _cal_JAPANESELUNISOLAR(): number {
    return 14;
  }
  get _cal_CHINESELUNISOLAR(): number {
    return 15;
  }
  get _cal_SAKA(): number {
    return 16;
  } // reserved to match Office but not implemented in our code
  get _cal_LUNAR_ETO_CHN(): number {
    return 17;
  } // reserved to match Office but not implemented in our code
  get _cal_LUNAR_ETO_KOR(): number {
    return 18;
  } // reserved to match Office but not implemented in our code
  get _cal_LUNAR_ETO_ROKUYOU(): number {
    return 19;
  } // reserved to match Office but not implemented in our code
  get _cal_KOREANLUNISOLAR(): number {
    return 20;
  }
  get _cal_TAIWANLUNISOLAR(): number {
    return 21;
  }
  get _cal_PERSIAN(): number {
    return 22;
  }
  get _cal_UMALQURA(): number {
    return 23;
  }

  // tslint:disable-next-line: variable-name
  m_currentEraValue = -1;

  static get _minSupportedDateTime(): Date {
    return new Date('100/1/1');
  }
  static get _maxSupportedDateTime(): Date {
    return new Date('9999/12/31');
  }

  get _id(): number {
    return -1;
  }

  get _baseCalendarID(): number {
    return this._id;
  }

  get _algorithmType(): CalendarAlgorithmType {
    return CalendarAlgorithmType.Unknown;
  }

  get currentEraValue(): number {
    // The following code assumes that the current era value can not be -1.
    // tslint:disable-next-line: triple-equals
    if (this.m_currentEraValue == -1) {
      this.m_currentEraValue = 1;
    }
    return this.m_currentEraValue;
  }

  // tslint:disable-next-line: variable-name
  static readonly _currentEra: number = 0;

  // tslint:disable-next-line: variable-name
  _twoDigitYearMax = -1;

  static checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
    if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
      throw "Clanedar wrong range exception";
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
