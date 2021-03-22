import { Calendar2 } from 'src/calendar';
import { Locale } from '../locale';
import { Zone } from '../zone';

const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

function padNumber(value: number, length: number) {
    value.toString().slice(-length).padStart(length, '0');
}

/** DateTime units. */
export interface DateTimeUnits {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
}

export interface DateTimeDescriptor extends DateTimeUnits {
    zone: number;
}

/** DateTime build options. */
export interface CreateOptions {
    calandar: Calendar2 | string;
    zone?: Zone | string | number;
    locale?: Locale | string;
}


interface DateTimeCachedValues {
    units: DateTimeUnits;
    ts: number;
    weekDay: number;
    dayOfYear: number;
    weekNumber: number;
    daysInMonth: number;
    daysInYear: number;
    isLeapYear: boolean;
    isValid: boolean;
}


/** DateTime parse result. */
export interface DateParseResult extends DateTimeUnits {
    offset: number;
}

/** An abstract base class for all JS-Sugar DateTime classes. */
export class DateTime {
    private _ts: number;
    private _cachedUnits: DateTimeUnits;
    private _zone: Zone;
    private _cal: Calendar2;
    private _locale: Locale;
    private _isValid: boolean;
    private _cache: DateTimeCachedValues;

    /**
     * Creates a new DateTime.
     * @constructor
     */

    constructor()
    constructor(opts: CreateOptions)
    constructor(timestamp: number, opts?: CreateOptions)
    constructor(date: string, opts?: CreateOptions)
    constructor(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, opts?: CreateOptions)
    constructor(opts: CreateOptions, year: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number)
    constructor(...args: any[]) {

        // this._ts = timestamp;
        // const isInt = Number.isInteger;
        // if (isInt(date)) {
        //     this._cachedTs = date;
        // } else if (isInt(date?.year)) {
        //     this._units = {
        //         year: date.year,
        //         month: isInt(date.month) ? date.month : 1,
        //         day: isInt(date.day) ? date.day : 1,
        //         hour: isInt(date.hour) ? date.hour : 0,
        //         minute: isInt(date.minute) ? date.minute : 0,
        //         second: isInt(date.second) ? date.second : 0,
        //         ms: isInt(date.ms) ? date.ms : 0,
        //     };
        // } else {
        //     throw Error('Invalid DateTime parameters.');
        // }

        // this._zone = opts.zone;
        // this._locale = locale ?? DateTime.getDefaultLocale();
    }

    //#region Creations
    /** Parses a date */
    static parseDate(date: string, format: string): DateParseResult {
        throw new Error('Method not implemented.');
    }

    //#endregion

    //#region Get
    /**
     * Gets a unit value of this DateTime.
     * @public
     */
    get(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms'): number {
        return this.toObject()[unit];
    }

    /** Get the year.
     * @public
     */
    get year(): number {
        return this.toObject().year;
    }

    /** Get the month (1-12).
     * @public
     */
    get month(): number {
        return this.toObject().month;
    }

    /** Get the day of the month (1 to 30). */
    get day(): number {
        return this.toObject().day;
    }

    /** Get the hour of the day (0 to 23). */
    get hour(): number {
        return this.toObject().hour;
    }

    /** Get the minute of the hour (0 to 59). */
    get minute(): number {
        return this.toObject().minute;
    }

    /** Get the second of the minute (0 to 59). */
    get second(): number {
        return this.toObject().second;
    }

    /** Get the millisecond of the second (0 to 999). */
    get ms(): number {
        return this.toObject().ms;
    }

    /** Returns UTC timestamp of this object (milliseconds past from the minimum supported DateTime). */
    get ts(): number {
        return this._cache.ts;
    }

    /** Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). */
    get weekDay(): number {
        if (this._cache.weekDay == null) {
            this._cache.weekDay = this._cal.weekDay(this.ts);
        }
        return this._cache.weekDay;
    }

    /** Get the day of the week with respect of this DateTime's locale (locale aware) */
    get weekDayLocale(): number {
        throw new Error('Method not implemented.');
    }

    /** Gets the human readable weekday name (locale aware). */
    weekDayName(format: 'S' | 'L' = 'L'): string {
        throw new Error('Method not implemented.');
    }

    /** Gets the day of the year (1 to 366). */
    get dayOfYear(): number {
        if (this._cache.dayOfYear == null) {
            this._cache.dayOfYear = this._cal.dayOfYear(this.ts);
        }
        return this._cache.dayOfYear;
    }

    /** Get the week number of the week year (1 to 52). */
    get weekNumber(): number {
        if (this._cache.weekNumber == null) {
            this._cache.weekNumber = this._cal.weekNumber(this.ts);
        }
        return this._cache.weekNumber;
    }

    /** Returns the number of days in this DateTime's month. */
    get daysInMonth(): number {
        if (this._cache.daysInMonth == null) {
            this._cache.daysInMonth = this._cal.daysInMonth(this.ts);
        }
        return this._cache.daysInMonth;
    }

    /** Returns the number of days in this DateTime's year. */
    get daysInYear(): number {
        if (this._cache.daysInYear == null) {
            this._cache.daysInYear = this._cal.daysInYear(this.ts);
        }
        return this._cache.daysInYear;
    }

    /** Returns the number of weeks in this DateTime's year. */
    // get weeksInYear(): number {
    //     if (this._cache.weeksInYear == null) {
    //         this._cache.weeksInYear = this._cal.(this.ts);
    //     }
    //     return this._cache.weeksInYear;
    // }

    /** Returns true if this DateTime is in a leap year, false otherwise. */
    get isLeapYear(): boolean {
        if (this._cache.daysInYear == null) {
            this._cache.isLeapYear = this._cal.isLeapYear(this.ts);
        }
        return this._cache.isLeapYear;
    }

    /** Get the quarter. */
    get quarter(): number {
        return Math.floor(this.month / 4) + 1;
    }
    //#endregion

    //#region Manipulate
    /** Adds a period of time to this DateTime and returns the resulting DateTime. */
    add(units: DateTimeUnits): DateTime {
        return new DateTime(this._cal.add(this.ts, units), { calandar: this._cal, zone: this._zone, locale: this._locale });
    }

    /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
    subtract(units: DateTimeUnits): DateTime {
        return new DateTime(this._cal.subtract(this.ts, units), { calandar: this._cal, zone: this._zone, locale: this._locale });
    }

    /** Clones this DateTime with time units (hour, minute, second, ms) set to zero. */
    date(): DateTime {
        throw new Error('Method not implemented.');
    }

    /** Clones this DateTime with overwritten values. */
    clone(newValues?: Partial<DateTimeUnits>): DateTime {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region Query
    /** Returns whether this DateTime is same as another DateTime. */
    isSame(dateTime: DateTime): boolean {
        return this._ts === dateTime.ts;
    }

    /** Returns whether the type of this DateTime is same as the type of another DateTime. */
    isSameType(dateTime: DateTime): boolean {
        throw new Error('Method not implemented.');
    }

    /** Returns whether this DateTime is after another DateTime. */
    isAfter(dateTime: DateTime): boolean {
        return this._ts > dateTime.ts;
    }

    /** Returns whether this DateTime is same or after another DateTime. */
    isSameOrAfter(dateTime: DateTime): boolean {
        return this._ts >= dateTime.ts;
    }

    /** Returns whether this DateTime is before another DateTime. */
    isBefore(dateTime: DateTime): boolean {
        return this._ts < dateTime.ts;
    }

    /** Returns whether this DateTime is same or before another DateTime. */
    isSameOrBefore(dateTime: DateTime): boolean {
        return this._ts <= dateTime.ts;
    }

    /** Returns whether this DateTime is between the specified DateTimes. */
    isBetween(first: DateTime, second: DateTime): boolean {
        return this.isAfter(first) && this.isBefore(second);
    }
    //#endregion

    //#region Display + Convert
    /** Returns a string representation of this DateTime formatted according to the specified format string. */
    format(format: string): string {
        const matches: any = {
            Y: this.year,
            Y2: padNumber(this.year, 2),
            Y4: padNumber(this.year, 4),
            M: this.month,
            MM: padNumber(this.month, 2),
            // MMM: getShort(locale.monthsShort, $M, months, 3),
            // MMMM: getShort(months, $M),
            D: this.day,
            D2: padNumber(this.day, 2),
            // d: String(this.$W),
            // dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
            // ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
            // dddd: weekdays[this.$W],
            H: this.hour,
            H2: padNumber(this.hour, 2),
            // h: get$H(1),
            // hh: get$H(2),
            // a: meridiemFunc($H, $m, true),
            // A: meridiemFunc($H, $m, false),
            m: this.minute,
            m2: padNumber(this.minute, 2),
            s: this.second,
            s2: padNumber(this.second, 2),
            ms: this.ms,
            ms3: padNumber(this.ms, 3),
            // SSS: Utils.s(this.$ms, 3, '0'),
            // Z: zoneStr // 'ZZ' logic below
        };

        return format.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match]);
    }

    /** Returns an object with the values of this DateTime. */
    toObject(): DateTimeUnits {
        if (this._cache.units == null) {
            this._cache.units = this._cal.getUnits(this._cache.ts);
        }
        return this._cache.units;
    }

    /** Returns an Array with the values of this DateTime. */
    toArray(): number[] {
        const u = this.toObject();
        return [u.year, u.month, u.day, u.hour, u.minute, u.second, u.ms];
    }

    /** Formats this DateTime to ISO8601 standard. */
    toISO(keepTimeZone = false): number[] {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region Locale
    /** Get the locale of a DateTime, such 'en-GB'. */
    get locale(): Locale {
        return this._locale;
    }
    //#endregion

    //#region TimeZone
    get zone(): Zone {
        return this._zone;
    }

    toUtc(): DateTime {
        throw new Error('Method not implemented.');
    }

    toJsDate(): Date {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region Misc
    /** Returns whether this DateTime is valid.
     * @public
     */
    get isValid(): boolean {
        if (this._cache.isValid == null) {
            const { year, month, day } = this.toObject();
            this._cache.isValid = this._cal.isValid(year, month, day);
        }
        return this._cache.isValid;
    }

    /** Returns whether a variable is a JS-Sugar DateTime or not. */
    static isJssDate(obj: any) {
        return obj instanceof DateTime;
    }
    //#endregion
}
