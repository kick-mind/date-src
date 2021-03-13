import { CalendarWeekRule, DayOfWeek } from '../calendars/calendar';
import { PersianCalendar } from '../calendars/persian/persian-calendar';
import { DateTime, DateTimeValues } from '../date-time';

export class PersianDate extends DateTime {
  constructor(date?: DateTimeValues) {
    // year: date?.year ?? d.getFullYear(),
    // month: date?.month ?? d.getMonth(),
    // day: date?.day ?? d.getDate(),
    // hour: date?.hour ?? 0,
    // minute: date?.minute ?? 0,
    // second: date?.second ?? 0,
    // ms: date?.ms ?? 0,

    super(date);
  }
  private _cal = new PersianCalendar();

  private getGDate(): Date {
    return this._cal.toDateTime(
      this.values.year,
      this.values.month,
      this.values.day,
      this.values.hour,
      this.values.minute,
      this.values.second,
      this.values.ms
    );
  }

  private addTime(amounts: DateTimeValues, sign: number) {
    let d = this.getGDate();

    if (amounts?.year) {
      d = this._cal.addYears(d, amounts.year * sign);
    }
    if (amounts?.month) {
      d = this._cal.addMonths(d, amounts.month * sign);
    }
    if (amounts?.day) {
      d = this._cal.addDays(d, amounts.day * sign);
    }
    if (amounts?.hour) {
      d = this._cal.addHours(d, amounts.hour * sign);
    }
    if (amounts?.minute) {
      d = this._cal.addMinutes(d, amounts.minute * sign);
    }
    if (amounts?.second) {
      d = this._cal.addSeconds(d, amounts.second * sign);
    }
    if (amounts?.ms) {
      d = this._cal.addMinutes(d, amounts.ms * sign);
    }

    return new Jalaali({
      year: this._cal.getYear(d),
      month: this._cal.getMonth(d),
      day: this._cal.getDayOfMonth(d),
      hour: this._cal.getHour(d),
      minute: this._cal.getMinute(d),
      second: this._cal.getSecond(d),
      ms: this._cal.getMilliseconds(d),
    });
  }

  add(amounts: DateTimeValues): DateTime {
    return this.addTime(amounts, 1);
  }

  subtract(amounts: DateTimeValues): DateTime {
    return this.addTime(amounts, -1);
  }

  diff(datetime: DateTime): number {
    let curGDate = this.getGDate();
    let tempGDate = this._cal.toDateTime(
      datetime.year,
      datetime.month,
      datetime.day,
      datetime.hour,
      datetime.minute,
      datetime.second,
      datetime.ms
    );

    return curGDate.getTime() - tempGDate.getTime();
  }

  clone(): DateTime {
    throw new Error('Method not implemented.');
  }

  get weekDay(): number {
    return this._cal.getDayOfWeek(this.getGDate());
  }

  get weeksInYear(): number {
    return Math.trunc(this._cal.getDaysInYear(this.year) / 7);
  }

  get weekNumber(): number {
      return this._cal.getWeekOfYear(this.getGDate(),CalendarWeekRule.FirstDay, DayOfWeek.Saturday);
  }

  get isInLeapYear(): boolean {
        return this._cal.isLeapYear(this.year);
  }

  get quarter(): number {
    return Math.floor(this.month / 4) + 1;
  }

  get daysInMonth(): number {
    return this._cal.getDaysInMonth(this.year,this.month);
  }

  get daysInYear(): number {
    return this._cal.getDaysInYear(this.year);
  }

  get isValid(): boolean {
    throw new Error('Method not implemented.');
  }
}
