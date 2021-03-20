export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum WeekRule {
  FirstDay = 0,
  FirstFullWeek = 1,
  FirstFourDayWeek = 2,
}
// tslint:disable: variable-name
// tslint:disable: member-ordering
// tslint:disable: triple-equals
export abstract class Calendar {
  protected static readonly _ticksPerSecond = 1000;
  protected static readonly _ticksPerMinute = Calendar._ticksPerSecond * 60;
  protected static readonly _ticksPerHour = Calendar._ticksPerMinute * 60;
  protected static readonly _ticksPerDay = Calendar._ticksPerHour * 24;
  private static readonly _maxMillis = 315537897600000;
  private static readonly _minDate = new Date('100/1/1');
  private static readonly _maxDate = new Date('9999/12/31');
  protected readonly daysInYear = 365;

  protected static checkAddResult(
    ticks: number,
    minValue: Date,
    maxValue: Date
  ) {
    if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
      throw new Error();
    }
  }

  add(time: number, value: number, scale: number): number {
    const millis: number = value * scale;
    if (
      !(
        millis > -Number(Calendar._maxMillis) &&
        millis < Number(Calendar._maxMillis)
      )
    ) {
      throw new Error();
    }
    const ticks: number = time + millis;
    Calendar.checkAddResult(ticks, Calendar._minDate, Calendar._maxDate);
    return ticks;
  }

  addMilliseconds(time: number, milliseconds: number): number {
    return this.add(time, milliseconds, 1);
  }
  addSeconds(time: number, seconds: number): number {
    return this.add(time, seconds, Calendar._ticksPerSecond);
  }
  addMinutes(time: number, minutes: number): number {
    return this.add(time, minutes, Calendar._ticksPerMinute);
  }
  addHours(time: number, hours: number): number {
    return this.add(time, hours, Calendar._ticksPerHour);
  }
  addDays(time: number, days: number): number {
    return this.add(time, days, Calendar._ticksPerDay);
  }
  addWeeks(time: number, weeks: number): number {
    return this.addDays(time, weeks * 7);
  }

  getMilliseconds(time: number): number {
    return time % 1000;
  }
  getSecond(time: number): number {
    return Math.trunc((time / Calendar._ticksPerSecond) % 60);
  }
  getMinute(time: number): number {
    return Math.trunc((time / Calendar._ticksPerMinute) % 60);
  }
  getHour(time: number): number {
    return Math.trunc((time / Calendar._ticksPerHour) % 24);
  }

  private getFirstDayWeekOfYear(time: number, firstDayOfWeek: number): number {
    const dayOfYear = this.getDayOfYear(time) - 1;
    const dayForJan1 = this.getDayOfWeek(time) - (dayOfYear % 7);
    const offset = (dayForJan1 - firstDayOfWeek + 14) % 7;
    return (dayOfYear + offset) / 7 + 1;
  }

  private getWeekOfYearFullDays(
    time: number,
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
    if (time <= this.addDays(Calendar._minDate.getTime(), dayOfYear)) {
      return this.getWeekOfYearOfMinDate(firstDayOfWeek, fullDays);
    }
    return this.getWeekOfYearFullDays(
      this.addDays(time, -(dayOfYear + 1)),
      firstDayOfWeek,
      fullDays
    );
  }

  private getWeekOfYearOfMinDate(
    firstDayOfWeek: number,
    minimumDaysInFirstWeek: number
  ): number {
    const dayOfYear = this.getDayOfYear(Calendar._minDate.getTime()) - 1;
    const dayOfWeekOfFirstOfYear =
      this.getDayOfWeek(Calendar._minDate.getTime()) - (dayOfYear % 7);

    const offset = (firstDayOfWeek + 7 - dayOfWeekOfFirstOfYear) % 7;
    if (offset == 0 || offset >= minimumDaysInFirstWeek) {
      return 1;
    }

    const daysInYear = this.daysInYear - 1;
    const dayOfWeekOfFirstOfPreviousYear =
      dayOfWeekOfFirstOfYear - 1 - (daysInYear % 7);

    const daysInInitialPartialWeek =
      (firstDayOfWeek - dayOfWeekOfFirstOfPreviousYear + 14) % 7;
    let day = daysInYear - daysInInitialPartialWeek;
    if (daysInInitialPartialWeek >= minimumDaysInFirstWeek) {
      day += 7;
    }
    return day / 7 + 1;
  }

  getWeekOfYear(
    time: number,
    rule: WeekRule,
    firstDayOfWeek: DayOfWeek
  ): number {
    if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
      throw new Error();
    }

    switch (rule) {
      case WeekRule.FirstDay:
        return this.getFirstDayWeekOfYear(time, firstDayOfWeek);
      case WeekRule.FirstFullWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 7);
      case WeekRule.FirstFourDayWeek:
        return this.getWeekOfYearFullDays(time, firstDayOfWeek, 4);
    }
  }

  protected timeToTicks(
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
      ms < Calendar._ticksPerSecond
    ) {
      return (
        hour * Calendar._ticksPerHour +
        minute * Calendar._ticksPerMinute +
        second * Calendar._ticksPerSecond +
        ms
      );
    }
    throw new Error();
  }

  abstract addMonths(time: number, months: number): number;
  abstract addYears(time: number, years: number): number;
  abstract getDayOfMonth(time: number): number;
  abstract getDayOfWeek(time: number): DayOfWeek;
  abstract getDayOfYear(time: number): number;
  abstract getDaysInMonth(year: number, month: number): number;
  abstract getDaysInYear(year: number): number;
  abstract getMonth(time: number): number;
  abstract getYear(time: number): number;
  abstract isLeapYear(year: number): boolean;
  abstract toDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    ms: number
  ): number;
}
