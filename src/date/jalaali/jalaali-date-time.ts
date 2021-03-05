import { DateTime, DateTimeAmounts, DateTimeDescriptor } from '../date-time';
import { Jalaali } from './jalaali';

export class JalaaliDateTime extends DateTime {
    private year: number;
    private month: number;
    private day: number;
    private hour: number;
    private minute: number;
    private second: number;
    private millisecond: number;
    constructor(date?: DateTimeDescriptor) {
        super();
        if (date) {
            this.set(date);
        }
    }
    toGregorian(datetime: DateTime): Date {
        const gDate = Jalaali.toGregorian(datetime.get('year'), datetime.get('month'), datetime.get('day'));
        return new Date(gDate.gy, gDate.gm, gDate.gd,
            this.hour, this.minute, this.millisecond);
    }
    get(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms'): number {
        switch (unit) {
            case 'year':
                return this.year;
            case 'month':
                return this.month;
            case 'day':
                return this.day;
            case 'hour':
                return this.hour;
            case 'minute':
                return this.minute;
            case 'second':
                return this.second;
            case 'ms':
                return this.millisecond;
            default:
                return this.toGregorian(this).getTime();
        }
    }
    set(value: DateTimeDescriptor): DateTime {
        this.year = value.year;
        this.month = value.month;
        this.day = value.day;
        this.hour = value.hour;
        this.minute = value.minute;
        this.second = value.second;
        this.millisecond = value.millisecond;
        return this;
    }
    add(amounts: DateTimeAmounts): DateTime {
        const gDateTemp = Jalaali.toGregorian(this.year, this.month, this.day);
        const gDate = new Date(gDateTemp.gy, gDateTemp.gm, gDateTemp.gd);
        gDate.setDate(Math.abs(gDate.getDate() + amounts.days));
        gDate.setMonth(Math.abs(gDate.getMonth() + amounts.months));
        gDate.setFullYear(Math.abs(gDate.getFullYear() + amounts.years));
        const result = new JalaaliDateTime();
        const jdate = Jalaali.toJalaali(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
        result.year = jdate.jy;
        result.month = jdate.jm;
        result.day = jdate.jd;
        result.hour = this.hour;
        result.minute = this.minute;
        result.second = this.second;
        result.millisecond = this.millisecond;

        return result;
    }
    subtract(amounts: DateTimeAmounts): DateTime {
        const gDateTemp = Jalaali.toGregorian(this.year , this.month , this.day);
        const gDate = new Date(gDateTemp.gy, gDateTemp.gm, gDateTemp.gd);
        if (amounts.days !== 0) {
            gDate.setDate(gDate.getDate() - amounts.days);
        }
        if (amounts.months !== 0) {
            gDate.setMonth(gDate.getMonth() - amounts.months);
        }
        if (amounts.years !== 0) {
            gDate.setFullYear(gDate.getFullYear() - amounts.years);
        }
        const result = new JalaaliDateTime();
        const jdate = Jalaali.toJalaali(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
        result.year = jdate.jy;
        result.month = jdate.jm;
        result.day = jdate.jd;
        result.hour = this.hour;
        result.minute = this.minute;
        result.second = this.second;
        result.millisecond = this.millisecond;
        return result;
    }
    isAfter(dateTime: DateTime): boolean {
        const gDate1 = this.toGregorian(dateTime);
        const gDate2 = this.toGregorian(this);
        return gDate1.getTime() > gDate2.getTime() ? true : false;
    }
    isSameOrAfter(dateTime: DateTime): boolean {
        const gDate1 = this.toGregorian(dateTime);
        const gDate2 = this.toGregorian(this);
        return gDate1.getTime() >= gDate2.getTime() ? true : false;
    }
    isBefore(dateTime: DateTime): boolean {
        const gDate1 = this.toGregorian(dateTime);
        const gDate2 = this.toGregorian(this);
        return gDate1.getTime() < gDate2.getTime() ? true : false;
    }
    isSameOrBefore(dateTime: DateTime): boolean {
        const gDate1 = this.toGregorian(dateTime);
        const gDate2 = this.toGregorian(this);
        return gDate1.getTime() <= gDate2.getTime() ? true : false;
    }
    clone(): DateTime {
        const result = new JalaaliDateTime();
        result.year = this.year;
        result.month = this.month;
        result.day = this.day;
        result.hour = this.hour;
        result.minute = this.minute;
        result.second = this.second;
        result.millisecond = this.millisecond;
        return result;
    }
    format(_string: any): string {
        throw new Error('Method not implemented.');
    }
    diff(datetime: DateTime): number {
        const gDate = new Date(this.toGregorian(this));
        const jDatetime = Jalaali.toGregorian(datetime.get('year'),
            datetime.get('month'),
            datetime.get('day'));
        const gStartDayOfTheYear = new Date(jDatetime.gy, jDatetime.gm, jDatetime.gd);
        return ((gDate.getTime() - gStartDayOfTheYear.getTime()));
    }
    get dayOfWeek(): number {
        const gDate = new Date(this.toGregorian(this));
        return gDate.getDate() % 7;
    }
    get weeksInYear(): number {
        const lastDayOfYear = new JalaaliDateTime();
        lastDayOfYear.year = this.year;
        lastDayOfYear.month = 12;
        lastDayOfYear.day = 29;
        if (this.isLeapYear) {
            lastDayOfYear.day = 30;
        }
        const gDate = new Date(this.toGregorian(lastDayOfYear));
        const startDayOfTheYear = Jalaali.toGregorian(this.year, 1, 1);
        const gStartDayOfTheYear = new Date(startDayOfTheYear.gy, startDayOfTheYear.gm, startDayOfTheYear.gd);
        const week1 = gDate.getTime() + (1000 * 60 * 60 * 24);
        const week2 = gStartDayOfTheYear.getTime();
        return Math.ceil((week1 - week2) / (1000 * 60 * 60 * 24 * 7));
    }
    get weekYear(): number {
        const gDate = new Date(this.toGregorian(this));
        const startDayOfTheYear = Jalaali.toGregorian(this.year, 1, 1);
        const gStartDayOfTheYear = new Date(startDayOfTheYear.gy, startDayOfTheYear.gm, startDayOfTheYear.gd);
        const week1 = gDate.getTime() + (1000 * 60 * 60 * 24);
        const week2 = gStartDayOfTheYear.getTime();
        return Math.ceil((week1 - week2) / (1000 * 60 * 60 * 24 * 7));
    }
    get isLeapYear(): boolean {
        return (Jalaali.isLeapJalaaliYear(this.year));
    }
    get quarter(): number {
        if (1 <= this.month && this.month <= 3) {
            return 1;
        } else if (4 <= this.month && this.month <= 6) {
            return 2;
        } else if (7 <= this.month && this.month <= 9) {
            return 3;
        }
        return 4;
    }

}
