import { Locale } from './locale';

const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

/** DateTime values.  */
export interface DateTimeValues {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
}

/** An abstract base class for all JS-Sugar DateTime classes.  */
export abstract class DateTime {
    private static _locales = new Array<Locale>();
    private static _defaultLocale: string;
    protected _date: DateTimeValues;
    protected _isValid: boolean;
    private _locale: string;

    /** Get the locale of a DateTime, such 'en-GB'. */
    get locale(): string {
        return this._locale;
    }

    /** Returns a JavaScript object with the values of this DateTime. */
    get values(): DateTimeValues {
        return { ...this._date };
    }

    /** Get the year. */
    get year(): number {
        return this._date.year;
    }

    /** Get the month (1-12). */
    get month(): number {
        return this._date.month;
    }

    /** Get the day of the month (1-30ish). */
    get day(): number {
        return this._date.day;
    }

    /** Get the hour of the day (0-23). */
    get hour(): number {
        return this._date.hour;
    }

    /** Get the minute of the hour (0-59). */
    get minute(): number {
        return this._date.minute;
    }

    /** Get the second of the minute (0-59). */
    get second(): number {
        return this._date.second;
    }

    /** Get the millisecond of the second (0-999). */
    get ms(): number {
        return this._date.year;
    }

    /** Returns the number of days in this DateTime's month. */
    abstract get daysInMonth(): number;

    /** Returns the number of days in this DateTime's year. */
    abstract get daysInYear(): number;

    /** Get the day of the week. */
    abstract get weekDay(): number;

    /** Returns the number of weeks in this DateTime's year. */
    abstract get weeksInYear(): number;

    /** Get the week number of the week year (1-52ish). */
    abstract get weekNumber(): number;

    /** Returns true if this DateTime is in a leap year, false otherwise. */
    abstract get isInLeapYear(): boolean;

    /** Returns whether the DateTime is valid. */
    get isValid(): boolean {
        return this._isValid;
    }

    /** Get the quarter. */
    abstract get quarter(): number;

    /** Create a new DateTime. */
    constructor(date: DateTimeValues, isValid: boolean, locale?: string) {
        this._date = date;
        this._isValid = isValid;
        this._locale = locale ?? DateTime.getDefaultLocale();
    }

    /** Adds a Locale. */
    static addLocale(locale: Locale): void {
        this._locales.push({ ...locale });

        if (this._locales.length === 0) {
            this._defaultLocale = locale.name;
        }
    }

    /** Finds a Locale by name. */
    static findLocale(localeName: string): Locale {
        const l = this._locales.find(x => x.name === localeName);
        return l ? { ...l } : null;
    }

    /** Sets the default Locale. */
    static setDefaultLocale(value: string) {
        this._defaultLocale = value;
    }

    /** Gets the default Locale name. */
    static getDefaultLocale(): string {
        return this._defaultLocale;
    }

    /** Add a period of time to this DateTime and return the resulting DateTime. */
    abstract add(amounts: DateTimeValues): DateTime;

    /** Subtract a period of time from this DateTime and return the resulting DateTime. */
    abstract subtract(amounts: DateTimeValues): DateTime;

    /** */
    abstract diff(datetime: DateTime): number;

    /** Returns a string representation of this DateTime formatted according to the specified format string. */
      format(format: string): string {
        const matches: any = {
            Y: `${this.year}`,
            Y2: this.year.toString().slice(-2),
            // M: $M + 1,
            // MM: Utils.s($M + 1, 2, '0'),
            // MMM: getShort(locale.monthsShort, $M, months, 3),
            // MMMM: getShort(months, $M),
            // D: this.$D,
            // DD: Utils.s(this.$D, 2, '0'),
            // d: String(this.$W),
            // dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
            // ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
            // dddd: weekdays[this.$W],
            // H: String($H),
            // HH: Utils.s($H, 2, '0'),
            // h: get$H(1),
            // hh: get$H(2),
            // a: meridiemFunc($H, $m, true),
            // A: meridiemFunc($H, $m, false),
            // m: String($m),
            // mm: Utils.s($m, 2, '0'),
            // s: String(this.$s),
            // ss: Utils.s(this.$s, 2, '0'),
            // SSS: Utils.s(this.$ms, 3, '0'),
            // Z: zoneStr // 'ZZ' logic below
        };

        return format.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match]);
    }

    /** Returns whether this DateTime is same as another DateTime. */
    isSame(dateTime: DateTime): boolean {
        const d1 = this._date;
        const d2 = dateTime.values;
        return d1.year === d2.year &&
            d1.month === d2.month &&
            d1.day === d2.day &&
            d1.hour === d2.hour &&
            d1.second === d2.second &&
            d1.minute === d2.minute &&
            d1.second === d2.second &&
            d1.ms === d2.ms;
    }

    /** Returns whether this DateTime is after another DateTime. */
    isAfter(dateTime: DateTime): boolean {
        const d1 = this._date;
        const d2 = dateTime.values;
        return d1.year > d2.year ||
            d1.month > d2.month ||
            d1.day > d2.day ||
            d1.hour > d2.hour ||
            d1.second > d2.second ||
            d1.minute > d2.minute ||
            d1.second > d2.second ||
            d1.ms > d2.ms;
    }

    /** Returns whether this DateTime is same or after another DateTime. */
    isSameOrAfter(dateTime: DateTime): boolean {
        return this.isAfter(dateTime) || this.isSame(dateTime);
    }

    /** Returns whether this DateTime is before another DateTime. */
    isBefore(dateTime: DateTime): boolean {
        const d1 = this.values;
        const d2 = dateTime.values;
        return d1.year < d2.year ||
            d1.month < d2.month ||
            d1.day < d2.day ||
            d1.hour < d2.hour ||
            d1.second < d2.second ||
            d1.minute < d2.minute ||
            d1.second < d2.second ||
            d1.ms < d2.ms;
    }

    /** Returns whether this DateTime is same or before another DateTime. */
    isSameOrBefore(dateTime: DateTime): boolean {
        return this.isBefore(dateTime) || this.isSame(dateTime);
    }
}
