import { Calendar, Calendars } from '../calendar';
import { Zone, Zones } from '../zone';
import { Locale, Locales } from '../locale';
import { DateTimeUnits, IsInt, IsObj, IsStr, padNum, throwInvalidParam, vClsCall, vObj, WeekdayNameFormat } from '../common';
const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|f{1,3}|c{1,2}|C{1,3}|a|A|z{1,3}|Z{1,3}/g;

const II = IsInt;
const IO = IsObj;
const IIN = (x: any) => x == null || IsInt(x); /** Is integer or null or undefined */
const C = (x: any) => ({ ...x }); // Clone object (shallow)

/** DateTime create options. */
export interface DateTimeCreateOptions {
    calendar?: Calendar | string; // A Calendar object or Calendar ID
    zone?: Zone | string; // | number :: zone offset (for next versions)
    locale?: Locale | string;
}

/** 
 * JS-Sugar DateTime. 
 * @public
 */
export class DateTime {
    #c: Calendar;
    #z: Zone;
    #l: Locale;
    #_: { // cache
        units: DateTimeUnits;
        ts: number; /** Timestamp (UTC) */
        weekDay: number;
        dayOfYear: number;
        weekNumber: number;
        daysInMonth: number;
        daysInYear: number;
        isLeapYear: boolean;
        isValid: boolean;
    } = {} as any;

    //#region Creations
    /**
     * Creates a new DateTime.
     * @constructor
     */
    constructor()
    constructor(opts: DateTimeCreateOptions)
    constructor(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, opts?: DateTimeCreateOptions)
    constructor(opts: DateTimeCreateOptions, year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number)
    constructor(timestamp: number, opts?: DateTimeCreateOptions)
    constructor() {
        vClsCall(this, DateTime);
        let ts: number;
        let year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number;
        let opts: DateTimeCreateOptions;

        // Resolve constructor parameters
        const a = arguments, a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
        let now = () => new Date().valueOf();
        if (a.length == 0) {
            // 1'st overload
            ts = now();
        } else if (IO(a0)) {
            // 2'nd overload
            ts = now();
            opts = C(a1);
        } else if (II(a0) && II(a1) && IIN(a2) && IIN(a3) && IIN(a4) && IIN(a4) && IIN(a6)) {
            // 3'nd overload
            year = a0; month = a1; day = a2; hour = a3; minute = a4; second = a5; ms = a6;
            opts = C(a7);
        } else if (IO(a0) && II(a1), II(a2), IIN(a3) && IIN(a4) && IIN(a5) && IIN(a6)) {
            // 4'rd overload
            opts = a0;
            year = a1; month = a2; day = a3; hour = a4; minute = a5; second = a6; ms = a7;
        } else if (II(a0) && (a1 == null || IO(a1))) {
            // 5'th overload (create by timestamp)
            ts = a0;
            opts = C(a1);
        } else {
            throwInvalidParam();
        }

        // Set DateTime value
        if (ts) {
            this.#_.ts = ts;
        } else {
            this.#_.units = {
                year,
                month,
                day: day ? day : 1,
                hour: hour ? hour : 0,
                minute: minute ? minute : 0,
                second: second ? second : 0,
                ms: ms ? ms : 0,
            };
        }

        const o = { throwError: true };

        // Resolve zone
        let z: any = opts?.zone;
        if (!z) {
            z = Zones.local;
        } else if (IsStr(z)) {
            z = Zones.find(z, o);
        } else {
            vObj(z, Zone, true, 'Invalid zone');
        }
        this.#z = z;

        // Resolve locale
        let l: any = opts?.locale;
        if (!l) {
            l = Locales.default;
        } else if (IsStr(l)) {
            l = Locales.resolve(l, { weekStart: 0 });
        } else {
            vObj(l, Locale, true, 'Invalid locale');
        }
        this.#l = l;

        // Resolve calendar
        let c: any = opts?.calendar;
        if (!c) {
            c = Calendars.default;
        } else if (IsStr(c)) {
            c = Calendars.findById(c, o);
        } else {
            vObj(c, Calendar, true, 'Invalid calendar');
        }
        this.#c = c;
    }

    // /** 
    //  * Creates a DateTime from a string
    //  * @public
    //  */
    // static parse(date: string, format: string, opts?: DateTimeCreateOptions): DateTime {
    //     throw new Error('Method not implemented.');
    // }

    /** 
     * Creates a DateTime from an object
     * @public
     */
    static fromObject(units: DateTimeUnits, opts?: DateTimeCreateOptions): DateTime {
        const u = units;
        return new DateTime(u.year, u.month, u.day, u.hour, u.minute, u.second, u.ms, opts);
    }

    /** 
     * Creates a DateTime from a Javascript Date object
     * @public
     */
    static fromJsDate(date: Date, opts?: { zone?: Zone | string, locale?: Locale | string }) {
        return new DateTime(date.valueOf(), { ...opts, calendar: Calendars.findById('gregorian') });
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

    /** 
     * Get the day of the month (1 to 30). 
     * @public
     */
    get day(): number {
        return this.toObject().day;
    }

    /**
     * Get the hour of the day (0 to 23). 
     * @public
     */
    get hour(): number {
        return this.toObject().hour;
    }

    /**
     * Get the minute of the hour (0 to 59). 
     * @public
     */
    get minute(): number {
        return this.toObject().minute;
    }

    /**
     * Get the second of the minute (0 to 59). 
     * @public
     */
    get second(): number {
        return this.toObject().second;
    }

    /** 
     * Get the millisecond of the second (0 to 999). 
     * @public
     */
    get ms(): number {
        return this.toObject().ms;
    }

    /**
     * Returns UTC timestamp of this object.  
     * This value can be positive or negetive (it depends on the implementation of the calendar). 
     * @public
     */
    get ts(): number {
        if (this.#_.ts == null) {
            const zoneTs = this.#c.getTimestamp(this.#_.units);
            this.#_.ts = zoneTs - this.#z.getOffset(zoneTs);
        }
        return this.#_.ts;
    }

    /**
     * Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). 
     * @public
     */
    get weekDay(): number {
        if (this.#_.weekDay == null) {
            this.#_.weekDay = this.#c.weekDay(this.ts);
        }
        return this.#_.weekDay;
    }

    /** 
     * Get the day of the week with respect of this DateTime's locale (locale aware) 
     * @public
     */
    get weekDayLocale(): number {
        return (this.locale.weekStart + this.weekDay) % 7;
    }

    /**
     * Gets the day of the year (1 to 366). 
     * @public 
     */
    get dayOfYear(): number {
        if (this.#_.dayOfYear == null) {
            this.#_.dayOfYear = this.#c.dayOfYear(this.ts);
        }
        return this.#_.dayOfYear;
    }

    /**
     * Get the week number of the week year (1 to 52). 
     * @public
     */
    get weekNumber(): number {
        if (this.#_.weekNumber == null) {
            this.#_.weekNumber = this.#c.weekNumber(this.ts, 1, 1);
        }
        return this.#_.weekNumber;
    }

    /**
     * Returns the number of days in this DateTime's month. 
     * @public
     */
    get daysInMonth(): number {
        if (this.#_.daysInMonth == null) {
            let u = this.toObject();
            this.#_.daysInMonth = this.#c.daysInMonth(u.year, u.month);
        }
        return this.#_.daysInMonth;
    }

    /**
     * Returns the number of days in this DateTime's year. 
     * @public
     */
    get daysInYear(): number {
        if (this.#_.daysInYear == null) {
            this.#_.daysInYear = this.#c.daysInYear(this.year);
        }
        return this.#_.daysInYear;
    }

    /** Returns the number of weeks in this DateTime's year. */
    // get weeksInYear(): number {
    //     if (this._cache.weeksInYear == null) {
    //         this._cache.weeksInYear = this._cal.(this.ts);
    //     }
    //     return this._cache.weeksInYear;
    // }

    /**
     * Returns true if this DateTime is in a leap year, false otherwise. 
     * @public
     */
    get isLeapYear(): boolean {
        if (this.#_.isLeapYear == null) {
            this.#_.isLeapYear = this.#c.isLeapYear(this.ts);
        }
        return this.#_.isLeapYear;
    }

    /** 
     * Get the quarter. 
     * @public
     */
    get quarter(): number {
        return Math.floor(this.month / 4) + 1;
    }

    /**
     * Returns the configurations of this object (calandar, zone and locale). 
     * @public
     */
    get config(): { calendar: Calendar, zone?: Zone, locale?: Locale } {
        return { calendar: this.#c, zone: this.#z, locale: this.#l };
    }
    //#endregion

    //#region Calculation
    /**
     * Adds a period of time to this DateTime and returns the resulting DateTime. 
     * @public
     */
    add(units: DateTimeUnits): DateTime {
        return new DateTime(this.#c.add(this.ts, units), this.config);
    }

    /** 
     * Subtracts a period of time from this DateTime and returns the resulting DateTime. 
     * @public 
     */
    subtract(units: DateTimeUnits): DateTime {
        return new DateTime(this.#c.subtract(this.ts, units), this.config);
    }

    /**
     * Clones this DateTime with time units (hour, minute, second, ms) set to zero. 
     * @public
     */
    getDate(): DateTime {
        const o = this.toObject();
        return new DateTime(this.config, o.year, o.month, o.day);
    }
    //#endregion

    //#region Query
    /**
     * Returns whether this DateTime is same as another DateTime.
     * @public
     */
    isSame(dateTime: DateTime): boolean {
        return this.ts == dateTime.ts;
    }

    /**
     * Returns whether this DateTime is after another DateTime.
     * @public
     */
    isAfter(dateTime: DateTime): boolean {
        return this.ts > dateTime.ts;
    }

    /** 
     * Returns whether this DateTime is same or after another DateTime.
     * @public
     */
    isSameOrAfter(dateTime: DateTime): boolean {
        return this.ts >= dateTime.ts;
    }

    /** 
     * Returns whether this DateTime is before another DateTime. 
     * @public
     */
    isBefore(dateTime: DateTime): boolean {
        return this.ts < dateTime.ts;
    }

    /** 
     * Returns whether this DateTime is same or before another DateTime. 
     * @public
     */
    isSameOrBefore(dateTime: DateTime): boolean {
        return this.ts <= dateTime.ts;
    }

    /** 
     * Returns whether this DateTime is between the specified DateTimes.
     * @public
     */
    isBetween(first: DateTime, second: DateTime): boolean {
        return this.ts > first.ts && this.ts < second.ts;
    }
    //#endregion

    //#region Display + Convert
    /** 
     * Returns a string representation of this DateTime formatted according to the specified format string. 
     * @public
     */
    format(format: string): string {
        const zone = () => {
            let o = this.#z.getOffset(this.ts); // offset
            let s = o > 0 ? 1 : -1; // sign
            return {
                s,
                o,
                hr: Math.floor(o / 60) * s,
                min: Math.floor(o % 60) * s,
            };
        };

        const matches: any = {
            Y: () => this.year,
            YY: () => padNum(this.year, 2),
            YYYY: () => padNum(this.year, 4),
            M: () => this.month,
            MM: () => padNum(this.month, 2),
            MMM: () => this.#l.getMonthNames(this.#c, 'short')[this.month - 1],
            MMMM: () => this.#l.getMonthNames(this.#c, 'long')[this.month - 1],
            d: () => this.day,
            dd: () => padNum(this.day, 2),
            H: () => this.hour,
            HH: () => padNum(this.hour, 2),
            h: () => this.hour % 12,
            hh: () => padNum(this.hour % 12, 2),
            m: () => this.minute,
            mm: () => padNum(this.minute, 2),
            s: () => this.second,
            ss: () => padNum(this.second, 2),
            f: () => this.ms,
            fff: () => padNum(this.ms, 3),
            c: () => this.weekDay,
            cc: () => this.weekDayLocale,
            C: () => this.#l.getWeekdayNames('narrow')[this.weekDayLocale],
            CC: () => this.#l.getWeekdayNames('short')[this.weekDayLocale],
            CCC: () => this.#l.getWeekdayNames('long')[this.weekDayLocale],
            z: () => { // Zone offset: +5
                let z = zone();
                return z.s > 0 ? `+${z.o}` : z.o;
            },
            zz: () => { // Zone offset: +05:00
                let z = zone();
                return `${z.s ? '+' : '-'}${padNum(z.hr, 2)}:${padNum(z.min, 2)}`;
            },
            zzz: () => { // Zone offset: +0500
                let z = zone();
                return `${z.s ? '+' : '-'}${padNum(z.hr, 2)}${padNum(z.min, 2)}`;
            },
            Z: () => this.#z.id, // Zone ID: America/New_York
            ZZ: () => this.#l.getZoneName(this.#z, 'short'), // Short zone name: EST
            ZZZ: () => this.#l.getZoneName(this.#z, 'long'), // Long zone name: Eastern Standard Time          
        };

        return format.replace(REGEX_FORMAT, (match, $1) => {
            let r;
            if ($1) {
                r = $1;
            } else if (matches[match]) {
                r = matches[match]();
            } else {
                r = match;
            }
            return r;
        });
    }

    /**
     * Returns an object with the values of this DateTime. 
     * @public
     */
    toObject(): DateTimeUnits {
        if (this.#_.units == null) {
            this.#_.units = this.#c.getUnits(this.#_.ts + this.#z.getOffset(this.#_.ts));
        }
        return this.#_.units;
    }

    /** 
     * Returns an Array with the values of this DateTime. 
     * @public
     */
    toArray(): number[] {
        const d = this.toObject();
        return [d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms];
    }

    /** 
     * Formats this DateTime to ISO8601 standard. 
     * @public
     */
    toISO(keepTimeZone = false): string {
        throw new Error('Method not implemented.');
    }

    /**
     * Converts this object to a javascript Date
     * @public
     */
    toJsDate(): Date {
        return new Date(this.ts);
    }
    //#endregion

    //#region Locale
    /** 
     * Get the locale of a DateTime, such 'en-GB'.
     * @public
     */
    get locale(): Locale {
        return this.#l;
    }

    /**
     * Sets the DateTime's locale (returns a new DateTime)
     * @public
     */
    toLocale(locale: Locale | string): DateTime {
        return new DateTime(this.ts, { locale, calendar: this.#c, zone: this.#z });
    }
    //#endregion

    //#region TimeZone
    /** 
     * Returns the zone of this DateTime object 
     * @public
     */
    get zone(): Zone {
        return this.#z;
    }

    /**
     * Set the DateTime's zone to UTC (returns a new DateTime) 
     * @public
     */
    toUtc(): DateTime {
        return this.toZone(Zones.utc);
    }

    /** 
     * Set the DateTime's zone to the local zone of the system (returns a new DateTime) 
     * @public
     */
    toLocal(): DateTime {
        return this.toZone(Zones.local);
    }

    /** 
     * Set the DateTime's zone (returns a new DateTime) 
     * @public
     */
    toZone(zone: Zone | string): DateTime {
        return new DateTime(this.ts, { calendar: this.#c, zone, locale: this.#l });
    }
    //#endregion

    //#region Calendar

    /**
     * Returns a new date time with the given calendar.
     * @public
     */
    to(calendar: Calendar | string): DateTime {
        return new DateTime(this.ts, { ...this.config, calendar });
    }

    /** 
     * Returns the calendar of this DateTime object
     * @public
     */
    get calendar() {
        return this.#c;
    }
    //#endregion

    //#region Misc

    /** 
     * Clones this DateTime with overrided new unit values.
     * @public
     */
    clone(newUnits?: DateTimeUnits): DateTime {
        return this.#_.ts ? new DateTime(this.#_.ts, this.config) : DateTime.fromObject({ ...this.#_.units, ...newUnits }, this.config);
    }

    /** Returns whether this DateTime is valid.
     * @public
     */
    get isValid(): boolean {
        if (this.#_.isValid == null) {
            const { year, month, day } = this.toObject();
            this.#_.isValid = this.#c.isValid(year, month, day);
        }
        return this.#_.isValid;
    }

    /**
     * Returns whether a variable is a JS-Sugar DateTime or not.
     * @public
     */
    static isJssDate(o: any) {
        return o instanceof DateTime;
    }
    //#endregion
}
