import { CreateOptions, DateTime, DateTimeUnits } from './date-time';
import { Locale } from '../locale';
import { FixedZone } from '../zone';
import { DayOfWeek } from '../calendar/calendar';
import { Persia } from 'src/calendar/persian/persia';

export class PersianDate extends DateTime {
  private _cal = new Persia();

  //#region Creation
  /**
   * Creates a PersianDate from a timestamp
   * @constructor
   */
  constructor(ts: number, opts?: CreateOptions) {
    super(ts, opts);
  }

  /** Creates a PersianDate from an object */
  static fromObject(date: DateTimeUnits, opts?: CreateOptions): PersianDate {
    const { year, month, day, hour, minute, second, ms } = date;
    // compute timestamp here
    // ...
    const timestamp = 0;
    return new PersianDate(timestamp, opts);
  }

  /** Creates a PersianDate by parsing a string with respect to the given 'format' string. */
  static parse(date: string, format: string, opts?: CreateOptions): PersianDate {
    const result = DateTime.parseDate(date, format);
    return PersianDate.fromObject(result, opts);
  }

  /** Creates a PersianDate, expressed as the local time */
  static local(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): PersianDate {
    return PersianDate.fromObject({ year, month, day, hour, minute, second, ms }, { zone: FixedZone.utc, locale });
  }

  /** Creates a PersianDate, expressed as the Coordinated Universal Time (UTC). */
  static utc(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): PersianDate {
    return PersianDate.fromObject({ year, month, day, hour, minute, second, ms }, { zone: FixedZone.utc, locale });
  }
  //#endregion

  //#region Get
  /** @private */
  private getGDate(): Date {
    throw new Error('Method not implemented.');
    // const d = this.toObject();
    // return this._cal.toDateTime(d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms);
  }

  protected compute(): DateTimeUnits {
    throw new Error('Method not implemented.');
  }

  public get weekDay(): number {
    return this._cal.getDayOfWeek(this.ts);
  }

  public get weeksInYear(): number {
    return Math.trunc(this._cal.getDaysInYear(this.year) / 7);
  }

  public get weekNumber(): number {
    throw new Error('Method not implemented.');
    // return this._cal.getWeekOfYear(this.toUtcTimestamp(), CalendarWeekRule.FirstDay, DayOfWeek.Saturday);
  }

  public get isInLeapYear(): boolean {
    return this._cal.isLeapYear(this.year);
  }

  public get daysInMonth(): number {
    return this._cal.getDaysInMonth(this.year, this.month);
  }

  public get daysInYear(): number {
    return this._cal.getDaysInYear(this.year);
  }

  public get dayOfYear(): number {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region Manipulate
  /** @private */
  private _add(amounts: DateTimeUnits, sign: number): PersianDate {
    throw new Error('Method not implemented.');
    // let d = this.getGDate();

    // if (amounts?.year) {
    //   d = this._cal.addYears(d, amounts.year * sign);
    // }
    // if (amounts?.month) {
    //   d = this._cal.addMonths(d, amounts.month * sign);
    // }
    // if (amounts?.day) {
    //   d = this._cal.addDays(d, amounts.day * sign);
    // }
    // if (amounts?.hour) {
    //   d = this._cal.addHours(d, amounts.hour * sign);
    // }
    // if (amounts?.minute) {
    //   d = this._cal.addMinutes(d, amounts.minute * sign);
    // }
    // if (amounts?.second) {
    //   d = this._cal.addSeconds(d, amounts.second * sign);
    // }
    // if (amounts?.ms) {
    //   d = this._cal.addMinutes(d, amounts.ms * sign);
    // }

    // return new PersianDate(
    //   this._cal.getYear(d),
    //   this._cal.getMonth(d),
    //   this._cal.getDayOfMonth(d),
    //   this._cal.getHour(d),
    //   this._cal.getMinute(d),
    //   this._cal.getSecond(d),
    //   this._cal.getMilliseconds(d),
    //   { zone: this.zone, locale: this.locale }
    // );
  }

  public add(amounts: DateTimeUnits): PersianDate {
    return this._add(amounts, 1);
  }

  public subtract(amounts: DateTimeUnits): PersianDate {
    return this._add(amounts, -1);
  }

  public withoutTime(): PersianDate {
    throw new Error('Method not implemented.');
  }

  public clone(newValues?: Partial<DateTimeUnits>): PersianDate {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region Display + Convert
  //#endregion

  //#region Misc
  protected validate(): boolean {
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
