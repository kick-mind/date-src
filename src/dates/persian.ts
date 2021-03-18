import { CalendarWeekRule, DayOfWeek } from '../calendars/calendar';
import { PersianCalendar } from '../calendars/persian/persian-calendar';
import { DateTime, DateTimeValues } from '../date-time';

export class PersianDate extends DateTime {
  private _cal = new PersianCalendar();

  constructor(date?: DateTimeValues) {
    super(date, true); // Replace with: super(date, _cal.isValidPersianDate(...));
  }

  private getGDate(): Date {
    return this._cal.toDateTime(
      this._date.year,
      this._date.month,
      this._date.day,
      this._date.hour,
      this._date.minute,
      this._date.second,
      this._date.ms
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

    return new PersianDate({
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

  get weekDay(): number {
    return this._cal.getDayOfWeek(this.getGDate());
  }

  get weeksInYear(): number {
    return Math.trunc(this._cal.getDaysInYear(this.year) / 7);
  }

  get weekNumber(): number {
    return this._cal.getWeekOfYear(this.getGDate(), CalendarWeekRule.FirstDay, DayOfWeek.Saturday);
  }

  get isInLeapYear(): boolean {
    return this._cal.isLeapYear(this.year);
  }

  get quarter(): number {
    return Math.floor(this.month / 4) + 1;
  }

  get daysInMonth(): number {
    return this._cal.getDaysInMonth(this.year, this.month);
  }

  get daysInYear(): number {
    return this._cal.getDaysInYear(this.year);
  }

  get isValid(): boolean {
    throw new Error('Method not implemented.');
  }
}
