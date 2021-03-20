import { Locale } from '../locale';
import { FixedZone } from '../zone';
import { CreateOptions, DateTime, DateTimeUnits } from './date-time';

export class GregorianDate extends DateTime {
    //#region Creation
    /**
     * Creates a GregorianDate from a timestamp
     * @constructor
     */
    constructor(ts: number, opts?: CreateOptions) {
        super(ts, opts);
    }

    /** Creates a GregorianDate from an object */
    static fromObject(date: DateTimeUnits, opts?: CreateOptions): GregorianDate {
        const { year, month, day, hour, minute, second, ms } = date;
        // compute timestamp here
        // ...
        const timestamp = 0;
        return new GregorianDate(timestamp, opts);
    }

    /** Creates a GregorianDate by parsing a string with respect to the given 'format' string. */
    static parse(date: string, format: string, opts?: CreateOptions): GregorianDate {
        const result = DateTime.parseDate(date, format);
        return GregorianDate.fromObject(result, opts);
    }

    /** Creates a GregorianDate, expressed as the local time */
    static local(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): GregorianDate {
        return GregorianDate.fromObject({ year, month, day, hour, minute, second, ms }, { zone: FixedZone.utc, locale });
    }

    /** Creates a GregorianDate, expressed as the Coordinated Universal Time (UTC). */
    static utc(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, locale?: Locale): GregorianDate {
        return GregorianDate.fromObject({ year, month, day, hour, minute, second, ms }, { zone: FixedZone.utc, locale });
    }
    //#endregion

    protected compute(): DateTimeUnits {
        throw new Error('Method not implemented.');
    }

    add(amounts: DateTimeUnits): DateTime {
        throw new Error('Method not implemented.');
        // const { gy, gm, gd } = Jalaali.toGregorian(this._value.year, this._value.month, this._value.day);
        // const d = new Date(gy, gm, gd);

        // if (amounts?.years) {
        //     d.setFullYear(Math.abs(d.getFullYear() + amounts.years));
        // }
        // if (amounts?.months) {
        //     d.setMonth(Math.abs(d.getMonth() + amounts.months));
        // }
        // if (amounts?.days) {
        //     d.setDate(Math.abs(d.getDate() + amounts.days));
        // }
        // if (amounts?.hours) {
        //     d.setHours(Math.abs(d.getHours() + amounts.hours));
        // }
        // if (amounts?.minutes) {
        //     d.setHours(Math.abs(d.getMinutes() + amounts.minutes));
        // }
        // if (amounts?.seconds) {
        //     d.setHours(Math.abs(d.getSeconds() + amounts.seconds));
        // }
        // if (amounts?.milliseconds) {
        //     d.setHours(Math.abs(d.getMilliseconds() + amounts.milliseconds));
        // }

        // return new JalaaliDateTime2({
        //     year: d.getFullYear(),
        //     month: d.getMonth(),
        //     day: d.getDate(),
        //     hour: d.getHours(),
        //     minute: d.getMinutes(),
        //     second: d.getSeconds(),
        //     ms: d.getMilliseconds(),
        // });
    }

    subtract(amounts: DateTimeUnits): DateTime {
        throw new Error('Method not implemented.');

        // const gDateTemp = Jalaali.toGregorian(this.year, this.month, this.day);
        // const gDate = new Date(gDateTemp.gy, gDateTemp.gm, gDateTemp.gd);
        // if (amounts.days !== 0) {
        //     gDate.setDate(gDate.getDate() - amounts.days);
        // }
        // if (amounts.months !== 0) {
        //     gDate.setMonth(gDate.getMonth() - amounts.months);
        // }
        // if (amounts.years !== 0) {
        //     gDate.setFullYear(gDate.getFullYear() - amounts.years);
        // }
        // const result = new JalaaliDateTime();
        // const jdate = Jalaali.toJalaali(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
        // result.year = jdate.jy;
        // result.month = jdate.jm;
        // result.day = jdate.jd;
        // result.hour = this.hour;
        // result.minute = this.minute;
        // result.second = this.second;
        // result.millisecond = this.millisecond;
        // return result;
    }

    get weekDay(): number {
        throw new Error('Method not implemented.');
        // const gDate = new Date(this.toGregorian(this));
        // return gDate.getDate() % 7;
    }

    get weeksInYear(): number {
        throw new Error('Method not implemented.');
        // const lastDayOfYear = new JalaaliDateTime2();
        // lastDayOfYear.year = this.year;
        // lastDayOfYear.month = 12;
        // lastDayOfYear.day = 29;
        // if (this.isLeapYear) {
        //     lastDayOfYear.day = 30;
        // }
        // const gDate = new Date(this.toGregorian(lastDayOfYear));
        // const startDayOfTheYear = Jalaali.toGregorian(this._value.year, 1, 1);
        // const gStartDayOfTheYear = new Date(startDayOfTheYear.gy, startDayOfTheYear.gm, startDayOfTheYear.gd);
        // const week1 = gDate.getTime() + (1000 * 60 * 60 * 24);
        // const week2 = gStartDayOfTheYear.getTime();
        // return Math.ceil((week1 - week2) / (1000 * 60 * 60 * 24 * 7));
    }

    get weekNumber(): number {
        throw new Error('Method not implemented.');
        // const gDate = new Date(this.toGregorian(this));
        // const startDayOfTheYear = Jalaali.toGregorian(this._value.year, 1, 1);
        // const gStartDayOfTheYear = new Date(startDayOfTheYear.gy, startDayOfTheYear.gm, startDayOfTheYear.gd);
        // const week1 = gDate.getTime() + (1000 * 60 * 60 * 24);
        // const week2 = gStartDayOfTheYear.getTime();
        // return Math.ceil((week1 - week2) / (1000 * 60 * 60 * 24 * 7));
    }

    get isInLeapYear(): boolean {
        throw new Error('Method not implemented.');
        // return (Jalaali.isLeapJalaaliYear(this._value.year));
    }

    get daysInMonth(): number {
        throw new Error('Method not implemented.');
    }

    get daysInYear(): number {
        throw new Error('Method not implemented.');
    }

    get dayOfYear(): number {
        throw new Error('Method not implemented.');
    }

    clone(newValues?: Partial<DateTimeUnits>): DateTime {
        throw new Error('Method not implemented.');
    }

    get isValid(): boolean {
        throw new Error('Method not implemented.');
    }

    withoutTime(): DateTime {
        throw new Error('Method not implemented.');
    }

    protected validate(): boolean {
        throw new Error('Method not implemented.');
    }
}

export type GDate = GregorianDate;
