import { Zone } from 'src/zone/zone';
import { CalendarWeekRule, DayOfWeek } from '../calendars/calendar';
import { PersianCalendar } from '../calendars/persian/persian-calendar';
import { DateTime, DateTimeUnits } from '../date-time';

export class PersianDate extends DateTime {
  private _cal = new PersianCalendar();

  //#region Creation
  constructor(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, timeZone?: Zone) {
    super(date, 0, true); // Replace with: super(date, _cal.isValidPersianDate(...));
  }

  static local() {

  }

  //#endregion

  //#region Get
  /** @private */
  private getGDate(): Date {
    const d = this.toObject();
    return this._cal.toDateTime(
      d.year,
      d.month,
      d.day,
      d.hour,
      d.minute,
      d.second,
      d.ms
    );
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

  get dayOfYear(): number {
    throw new Error('Method not implemented.');
  }

  //#endregion

  //#region Manipulate
  /** @private */
  private addTime(amounts: DateTimeUnits, sign: number) {
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

  add(amounts: DateTimeUnits): DateTime {
    return this.addTime(amounts, 1);
  }

  subtract(amounts: DateTimeUnits): DateTime {
    return this.addTime(amounts, -1);
  }

  clone(newValues?: Partial<DateTimeUnits>): DateTime {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region Query

  //#endregion

  //#region Display + Convert
  toUtcTimestamp(): number {
    throw new Error('Method not implemented.');
  }

  //#endregion

  //#region Locale

  //#endregion

  //#region TimeZone

  //#endregion DateTime support
  static get min(): DateTime {
    throw new Error('Method not implemented.');
  }

  static get max(): DateTime {
    throw new Error('Method not implemented.');
  }
  //#region
}
