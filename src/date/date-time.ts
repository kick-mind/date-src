import { Calendar2, Calendars } from 'src/calendar';
import { Locales } from 'src/locale/locales';
import { Zones } from 'src/zone/zones';
import { Locale } from '../locale';
import { Zone } from '../zone';

const II = Number.isInteger; // Is Integer?
const IO = (x: any) => typeof x == 'object'; // Is Object ?
const C = (x: any) => ({ ...x }); // Clone Object
const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

function padNumber(value: number, length: number) {
    value.toString().slice(-length).padStart(length, '0');
}

/** DateTime units. */
export interface DateTimeUnits {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    ms?: number;
}

/** DateTime create options. */
export interface DateTimeCreateOptions {
    calendar: Calendar2 | string;
    zone?: Zone | string; // | number :: zone offset (for next versions)
    locale?: Locale | string;
}

interface DateTimeCachedValues {
    units: DateTimeUnits;
    /** Timestamp (UTC) */
    ts: number;
    weekDay: number;
    dayOfYear: number;
    weekNumber: number;
    daysInMonth: number;
    daysInYear: number;
    isLeapYear: boolean;
    isValid: boolean;
}


/** JS-Sugar DateTime. */
export class DateTime {
    private _cal: Calendar2;
    private _zone: Zone;
    private _locale: Locale;
    private _cache: DateTimeCachedValues;
    private _: {
        /** resolved create options */
        opts: DateTimeCreateOptions,
        units: DateTimeCachedValues,
        /** Timestamp (UTC) */
        ts: number;
        weekDay: number;
        dayOfYear: number;
        weekNumber: number;
        daysInMonth: number;
        daysInYear: number;
        isLeapYear: boolean;
        isValid: boolean;
    };
    // #_: { c: Calendar2, z: Zone, l: Locale };

    //#region Creations
    /**
     * Creates a new DateTime.
     * @constructor
     */
    constructor()
    constructor(opts: DateTimeCreateOptions)
    constructor(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, opts?: DateTimeCreateOptions)
    constructor(opts: DateTimeCreateOptions, year: number, month?: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number)
    constructor(timestamp: number, opts?: DateTimeCreateOptions)
    constructor() {
        const a = arguments;
        let ts: number;
        let year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number;
        let opts: DateTimeCreateOptions;

        if (a.length == 0) {
            // first overload
        } else if (IO(a[0])) {
            // 2'nd overload
            opts = C(a[0]);
        } else if (II(a[0]) && II(a[1])) {
            // 2'nd overload
            year = a[0]; month = a[1]; day = a[2]; hour = a[3]; minute = a[4]; second = a[5]; ms = a[6];
            opts = C(a[7]);
        } else if (IO(a[0]) && II(a[1])) {
            // 3'rd overload
            opts = a[0];
            year = a[1]; month = a[2]; day = a[3]; hour = a[4]; minute = a[5]; second = a[6]; ms = a[7];
        } else if (II(a[0]) && (a[1] == null || IO(a[1]))) {
            // 5'th overload (create by timestamp)
            ts = a[0];
            opts = C(a[1]);
        } else {
            throw new Error('Invalid parameters.');
        }

        if (ts) {
            this._cache.ts = ts;
        } else if (year && month) {
            this._cache.units = {
                year,
                month,
                day: II(day) ? day : 1,
                hour: II(hour) ? hour : 0,
                minute: II(minute) ? minute : 0,
                second: II(second) ? second : 0,
                ms: II(ms) ? ms : 0,
            };
        } else {
            this._cache.units = this._cal.getUnits(new Date().getTime());
        }

        const o = { throwError: true };

        const z = opts?.zone;
        this._zone = z instanceof Zone ? z : (typeof z == 'string' ? Zones.find(z, o) : Zones.local);

        const l = opts?.locale;
        this._.opts.locale = l instanceof Locale ? l : (typeof l == 'string' ? Locales.find(l, o) : Locales.default);

        const c = opts?.calendar;
        this._cal = c instanceof Calendar2 ? c : (typeof c == 'string' ? Calendars.find(c, o) : Calendars.default);
    }

    /** 
     * Creates a DateTime from a string
     */
    static parse(date: string, format: string, opts?: DateTimeCreateOptions): DateTime {
        throw new Error('Method not implemented.');
    }

    /** 
     * Creates a DateTime from an object
     */
    static fromObject(units: DateTimeUnits, opts?: DateTimeCreateOptions): DateTime {
        const u = units;
        if (!u || !II(u.year) || !II(u.month) ) {
            throw new Error('year and month are required.');
        }

        return new DateTime(u.year, u.month, u.day, u.hour, u.minute, u.second, u.ms, opts);
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

    /** Returns UTC timestamp of this object.  
     * This value can be positive or negetive (it depends on the implementation of the calendar). 
     */
    get ts(): number {
        if (this._cache.ts == null) {
            const zoneTs = this._cal.getTimestamp(this._cache.units);
            const utcTs = zoneTs - this._zone.getOffset(zoneTs);
            this._cache.ts = utcTs;
        }

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
            this._cache.weekNumber = this._cal.weekNumber(this.ts, 1, 1);
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

    /** Returns the configurations of this object (calandar, zone and locale). */
    get config(): { calendar: Calendar2, zone?: Zone, locale?: Locale } {
        return { calendar: this._cal, zone: this._zone, locale: this._locale };
    }
    //#endregion

    //#region Calculation
    /** Adds a period of time to this DateTime and returns the resulting DateTime. */
    add(units: DateTimeUnits): DateTime {
        return new DateTime(this._cal.add(this.ts, units), this.config);
    }

    /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
    subtract(units: DateTimeUnits): DateTime {
        return new DateTime(this._cal.subtract(this.ts, units), this.config);
    }

    /** Clones this DateTime with time units (hour, minute, second, ms) set to zero. */
    getDate(): DateTime {
        const o = this.toObject();
        return new DateTime(this.config, o.year, o.month, o.day);
    }
    //#endregion

    //#region Query
    /** Returns whether this DateTime is same as another DateTime. */
    isSame(dateTime: DateTime): boolean {
        return this.ts === dateTime.ts;
    }

    /** Returns whether the type of this DateTime is same as the type of another DateTime. */
    isSameType(dateTime: DateTime): boolean {
        throw new Error('Method not implemented.');
    }

    /** Returns whether this DateTime is after another DateTime. */
    isAfter(dateTime: DateTime): boolean {
        return this.ts > dateTime.ts;
    }

    /** Returns whether this DateTime is same or after another DateTime. */
    isSameOrAfter(dateTime: DateTime): boolean {
        return this.ts >= dateTime.ts;
    }

    /** Returns whether this DateTime is before another DateTime. */
    isBefore(dateTime: DateTime): boolean {
        return this.ts < dateTime.ts;
    }

    /** Returns whether this DateTime is same or before another DateTime. */
    isSameOrBefore(dateTime: DateTime): boolean {
        return this.ts <= dateTime.ts;
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
            const ts = this._cache.ts;
            this._cache.units = this._cal.getUnits(ts + this._zone.getOffset(ts));
        }
        return this._cache.units;
    }

    /** Returns an Array with the values of this DateTime. */
    toArray(): number[] {
        const d = this.toObject();
        return [d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms];
    }

    /** Formats this DateTime to ISO8601 standard. */
    toISO(keepTimeZone = false): string {
        throw new Error('Method not implemented.');
    }

    // toJsDate(): Date {
    //     throw new Error('Method not implemented.');
    // }
    //#endregion

    //#region Locale
    /** Get the locale of a DateTime, such 'en-GB'. */
    get locale(): Locale {
        return this._locale;
    }

    /** Set the DateTime's locale (returns a new DateTime) */
    toLocale(locale: Locale | string): DateTime {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region TimeZone
    get zone(): Zone {
        return this._zone;
    }

    /** Set the DateTime's zone to UTC (returns a new DateTime) */
    toUtc(): DateTime {
        return this.toZone(Zones.utc);
    }

    /** Set the DateTime's zone to the local zone of the system (returns a new DateTime) */
    toLocal(): DateTime {
        return this.toZone(Zones.local);
    }

    /** Set the DateTime's zone (returns a new DateTime) */
    toZone(zone: Zone | string): DateTime {
        return new DateTime(this.ts, { calendar: this._cal, zone, locale: this._locale });
    }
    //#endregion

    //#region Calendar

    /**
     * Returns a new date time with the given calendar.
     */
    to(calendar: Calendar2 | string): DateTime {
        return new DateTime(this.ts, { ...this.config, calendar });
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
    static isJssDate(o: any) {
        return o instanceof DateTime;
    }

    /** Clones this DateTime with overrided unit values. */
    clone(newUnits?: DateTimeUnits): DateTime {
        const opts = this.config;

        if (newUnits) {
            return DateTime.fromObject({ ...this.toObject(), ...newUnits }, opts);
        } else {
            return this._cache.ts ? new DateTime(this._cache.ts, opts) : DateTime.fromObject(this._cache.units, opts);
        }
    }
    //#endregion
}
