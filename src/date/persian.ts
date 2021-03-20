import { CreateOptions, DateTime, DateTimeUnits } from './date-time';
import { Locale } from '../locale';
import { FixedZone } from '../zone';
import { CalendarWeekRule, DayOfWeek } from '../calendar/calendar';
import { PersianCalendar } from '../calendar/persian/persian-calendar';

export class PersianDate extends DateTime {
  private _cal = new PersianCalendar();
  private _ts: number; // utc time stamp

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

  /** Creates a PersianDate, expressed as the local time */
  local(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): PersianDate {
    // compute persian date here ...
    // ...
    return new PersianDate(year, month, day, hour, minute, second, ms, { zone: FixedZone.utc, locale });
  }

  /** Creates a PersianDate, expressed as the Coordinated Universal Time (UTC). */
  utc(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): PersianDate {
    return new PersianDate(year, month, day, hour, minute, second, ms, { zone: FixedZone.utc, locale });
  }
  //#endregion

  //#region Get
  /** @private */
  private getGDate(): Date {
    const d = this.toObject();
    return this._cal.toDateTime(d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms);
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
  private _add(amounts: DateTimeUnits, sign: number): PersianDate {
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
    return this._add(amounts, 1);
  }

  subtract(amounts: DateTimeUnits): PersianDate {
    return this._add(amounts, -1);
  }

  withoutTime(): PersianDate {
    throw new Error('Method not implemented.');
  }

  clone(newValues?: Partial<DateTimeUnits>): PersianDate {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region Display + Convert
  toUtcTimestamp(): number {
    if (this._ts == null) {
      // compute timestamp here ...
      throw new Error('Method not implemented.');
    }

    return this._ts;
  }
  //#endregion

  //#region Misc
  protected valid(): boolean {
    // compute validity here...
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
