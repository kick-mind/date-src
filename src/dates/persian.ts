import { FixedZone } from 'src/zone/FixedZone';
import { Zone } from 'src/zone/zone';
import { CalendarWeekRule, DayOfWeek } from '../calendars/calendar';
import { PersianCalendar } from '../calendars/persian/persian-calendar';
import { CreateOptions, DateTime, DateTimeUnits } from '../date-time';

export class PersianDate extends DateTime {
  private _cal = new PersianCalendar();

  //#region Creation
  /**
   * Creates a new PersianDate.
   * @constructor
   */
  constructor(year: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, opts?: CreateOptions) {
    super(year, month, day, hour, minute, second, ms, opts);
  }

  /** Creates a PersianDate from an object */
  static fromObject(date: DateTimeUnits, opts?: CreateOptions): PersianDate {
    const { year, month, day, hour, minute, second, ms } = date;
    return new PersianDate(year, month, day, hour, minute, second, ms, opts);
  }

  /** Creates a PersianDate by parsing a string with respect to the given 'format' string. */
  static parse(date: string, format: string, opts?: CreateOptions): PersianDate {
    const result = DateTime.parseDate(date, format);
    return PersianDate.fromObject(result, opts);
  }

  /** Creates a PersianDate object that is set to the current date and time on this computer, expressed as the local time */
  local(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: string): PersianDate {
    return new PersianDate(year, month, day, hour, minute, second, ms, { zone: FixedZone.utc, locale });
  }

  /** Creates a PersianDate object that is set to the current date and time on this computer, expressed as the Coordinated Universal Time (UTC). */
  utc(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: string): PersianDate {
    return new PersianDate(year, month, day, hour, minute, second, ms, { zone: FixedZone.utc, locale });
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
  private addTime(amounts: DateTimeUnits, sign: number): PersianDate {
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

    return new PersianDate(
      this._cal.getYear(d),
      this._cal.getMonth(d),
      this._cal.getDayOfMonth(d),
      this._cal.getHour(d),
      this._cal.getMinute(d),
      this._cal.getSecond(d),
      this._cal.getMilliseconds(d),
      { zone: this.zone, locale: this.locale }
    );
  }

  add(amounts: DateTimeUnits): PersianDate {
    return this.addTime(amounts, 1);
  }

  subtract(amounts: DateTimeUnits): PersianDate {
    return this.addTime(amounts, -1);
  }

  date(): PersianDate {
    throw new Error('Method not implemented.');
  }

  clone(newValues?: Partial<DateTimeUnits>): PersianDate {
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

  //#region Misc
  get isValid(): boolean {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#endregion DateTime Range support
  static get min(): PersianDate {
    throw new Error('Method not implemented.');
  }

  static get max(): PersianDate {
    throw new Error('Method not implemented.');
  }
  //#region
}
