import { DateTime, DateTimeValues } from './date-time';

export class GregorianDateTime extends DateTime {
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

    add(amounts: DateTimeValues): DateTime {
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

    subtract(amounts: DateTimeValues): DateTime {
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

    diff(datetime: DateTime): number {
        throw new Error('Method not implemented.');

        // const gDate = new Date(this.toGregorian(this));
        // const jDatetime = Jalaali.toGregorian(datetime.get('year'),
        //     datetime.get('month'),
        //     datetime.get('day'));
        // const gStartDayOfTheYear = new Date(jDatetime.gy, jDatetime.gm, jDatetime.gd);
        // return ((gDate.getTime() - gStartDayOfTheYear.getTime()));
    }

    clone(): DateTime {
        throw new Error('Method not implemented.');
    }

    get dayOfWeek(): number {
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

    get weekYear(): number {
        throw new Error('Method not implemented.');
        // const gDate = new Date(this.toGregorian(this));
        // const startDayOfTheYear = Jalaali.toGregorian(this._value.year, 1, 1);
        // const gStartDayOfTheYear = new Date(startDayOfTheYear.gy, startDayOfTheYear.gm, startDayOfTheYear.gd);
        // const week1 = gDate.getTime() + (1000 * 60 * 60 * 24);
        // const week2 = gStartDayOfTheYear.getTime();
        // return Math.ceil((week1 - week2) / (1000 * 60 * 60 * 24 * 7));
    }

    get isLeapYear(): boolean {
        throw new Error('Method not implemented.');
        // return (Jalaali.isLeapJalaaliYear(this._value.year));
    }

    get quarter(): number {
        return Math.floor(this.month / 4) + 1;
    }
}
