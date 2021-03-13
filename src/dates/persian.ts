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

    add(amounts: DateTimeValues): DateTime {
        let cal = new PersianCalendar();

        let d = cal.toDateTime(this.values.year, this.values.month, this.values.day
            ,this.values.hour, this.values.minute, this.values.second, this.values.ms);

        if (amounts?.year) {
            d = cal.addYears(d, amounts.year);
        }
        if (amounts?.month) {
            d = cal.addMonths(d, amounts.month);
        }
        if (amounts?.day) {
            d = cal.addDays(d, amounts.day);
        }
        if (amounts?.hour) {
            d = cal.addHours(d, amounts.hour);
        }
        if (amounts?.minute) {
            d = cal.addMinutes(d, amounts.minute);
        }
        if (amounts?.second) {
            d = cal.addSeconds(d, amounts.second);
        }
        if (amounts?.ms) {
            d = cal.addMinutes(d, amounts.ms);
        }

        return new Jalaali({
            year: cal.getYear(d) ,
            month: cal.getMonth(d) ,
            day: cal.getDayOfMonth(d),
            hour: cal.getHour(d),
            minute: cal.getMinute(d),
            second: cal.getSecond(d),
            ms: cal.getMilliseconds(d),
        });
    }

    subtract(amounts: DateTimeValues): DateTime {
        let cal = new PersianCalendar();

        let d = cal.toDateTime(this.values.year, this.values.month, this.values.day
            ,this.values.hour, this.values.minute, this.values.second, this.values.ms);

        if (amounts?.year) {
            d = cal.addYears(d, -amounts.year);
        }
        if (amounts?.month) {
            d = cal.addMonths(d, -amounts.month);
        }
        if (amounts?.day) {
            d = cal.addDays(d, -amounts.day);
        }
        if (amounts?.hour) {
            d = cal.addHours(d, -amounts.hour);
        }
        if (amounts?.minute) {
            d = cal.addMinutes(d, -amounts.minute);
        }
        if (amounts?.second) {
            d = cal.addSeconds(d, -amounts.second);
        }
        if (amounts?.ms) {
            d = cal.addMinutes(d, -amounts.ms);
        }

        return new Jalaali({
            year: cal.getYear(d) ,
            month: cal.getMonth(d) ,
            day: cal.getDayOfMonth(d),
            hour: cal.getHour(d),
            minute: cal.getMinute(d),
            second: cal.getSecond(d),
            ms: cal.getMilliseconds(d),
        });
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

    get weekDay(): number {
        let cal = new PersianCalendar();

        let d = cal.toDateTime(this.values.year, this.values.month, this.values.day
            ,this.values.hour, this.values.minute, this.values.second, this.values.ms);

        return cal.getDayOfWeek(d);
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

    get quarter(): number {
        return Math.floor(this.month / 4) + 1;
    }

    get daysInMonth(): number {
        throw new Error('Method not implemented.');
    }
    
    get daysInYear(): number {
        throw new Error('Method not implemented.');
    }

    get isValid(): boolean {
        throw new Error('Method not implemented.');
    }
}
