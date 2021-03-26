import { Calendar, Calendars } from '../calendar';
import { Zone, Zones } from '../zone';
import { Locale, Locales } from '../locale';
import { DateTimeUnits, IsInt, IsObj, IsStr, padNumber, verifyClassCall, verifyObject } from '../common';

const II = IsInt;
const IO = IsObj;
const IIN = (x: any) => x == null || IsInt(x); /** Is integer or null or undefined */
const C = (x: any) => ({ ...x }); // Clone object (shallow)
const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

/** DateTime create options. */
export interface DateTimeCreateOptions {
    calendar?: Calendar | string; // A Calendar object or Calendar ID
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
    private _c: Calendar;
    private _z: Zone;
    private _l: Locale;
    private _: { // Cache
        units: DateTimeUnits;
        ts: number; /** Timestamp (UTC) */
        weekDay: number;
        dayOfYear: number;
        weekNumber: number;
        daysInMonth: number;
        daysInYear: number;
        isLeapYear: boolean;
        isValid: boolean;
    };

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
        verifyClassCall(this, DateTime);
        let ts: number;
        let year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number;
        let opts: DateTimeCreateOptions;


        // Resolve constructor parameters
        const a = arguments, a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
        let now = () => new Date().valueOf();
        if (a.length == 0) { // 1'st overload
            ts = now();
        } else if (IO(a0)) {  // 2'nd overload
            ts = now();
            opts = C(a1);
        } else if (II(a0) && II(a1) && IIN(a2) && IIN(a3) && IIN(a4) && IIN(a4) && IIN(a6)) { // 3'nd overload
            year = a0; month = a1; day = a2; hour = a3; minute = a4; second = a5; ms = a6;
            opts = C(a7);
        } else if (IO(a0) && II(a1), II(a2), IIN(a3) && IIN(a4) && IIN(a5) && IIN(a6)) { // 4'rd overload
            opts = a0;
            year = a1; month = a2; day = a3; hour = a4; minute = a5; second = a6; ms = a7;
        } else if (II(a0) && (a1 == null || IO(a1))) { // 5'th overload (create by timestamp)
            ts = a0;
            opts = C(a1);
        } else {
            throw new Error('Invalid parameters.');
        }

        // Set DateTime value
        if (ts) {
            this._.ts = ts;
        } else {
            this._.units = {
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
        if (z == null) {
            z = Zones.local;
        } else if (IsStr(z)) {
            z = Zones.find(z, o);
        } else {
            verifyObject(z, Zone, 'Invalid zone');
        }
        this._z = z;

        // Resolve locale
        let l: any = opts?.locale;
        if (l == null) {
            l = Locales.default;
        } else if (IsStr(l)) {
            l = Locales.find(l, o);
        } else {
            verifyObject(l, Locale, 'Invalid locale');
        }
        this._l = l;

        // Resolve calendar
        let c: any = opts?.calendar;
        if (c == null) {
            c = Calendars.default;
        } else if (IsStr(c)) {
            c = Calendars.findById(c, o);
        } else {
            verifyObject(c, Calendar, 'Invalid calendar');
        }
        this._c = c;
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
        if (this._.ts == null) {
            const zoneTs = this._c.getTimestamp(this._.units);
            const utcTs = zoneTs - this._z.getOffset(zoneTs);
            this._.ts = utcTs;
        }

        return this._.ts;
    }

    /** Gets the ISO day of the week with (Monday = 1, ..., Sunday = 7). */
    get weekDay(): number {
        if (this._.weekDay == null) {
            this._.weekDay = this._c.weekDay(this.ts);
        }
        return this._.weekDay;
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
        if (this._.dayOfYear == null) {
            this._.dayOfYear = this._c.dayOfYear(this.ts);
        }
        return this._.dayOfYear;
    }

    /** Get the week number of the week year (1 to 52). */
    get weekNumber(): number {
        if (this._.weekNumber == null) {
            this._.weekNumber = this._c.weekNumber(this.ts, 1, 1);
        }
        return this._.weekNumber;
    }

    /** Returns the number of days in this DateTime's month. */
    get daysInMonth(): number {
        if (this._.daysInMonth == null) {
            let u = this.toObject();
            this._.daysInMonth = this._c.daysInMonth(u.year, u.month);
        }
        return this._.daysInMonth;
    }

    /** Returns the number of days in this DateTime's year. */
    get daysInYear(): number {
        if (this._.daysInYear == null) {
            this._.daysInYear = this._c.daysInYear(this.year);
        }
        return this._.daysInYear;
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
        if (this._.daysInYear == null) {
            this._.isLeapYear = this._c.isLeapYear(this.ts);
        }
        return this._.isLeapYear;
    }

    /** Get the quarter. */
    get quarter(): number {
        return Math.floor(this.month / 4) + 1;
    }

    /** Returns the configurations of this object (calandar, zone and locale). */
    get config(): { calendar: Calendar, zone?: Zone, locale?: Locale } {
        return { calendar: this._c, zone: this._z, locale: this._l };
    }
    //#endregion

    //#region Calculation
    /** Adds a period of time to this DateTime and returns the resulting DateTime. */
    add(units: DateTimeUnits): DateTime {
        return new DateTime(this._c.add(this.ts, units), this.config);
    }

    /** Subtracts a period of time from this DateTime and returns the resulting DateTime. */
    subtract(units: DateTimeUnits): DateTime {
        return new DateTime(this._c.subtract(this.ts, units), this.config);
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
        if (this._.units == null) {
            const ts = this._.ts;
            this._.units = this._c.getUnits(ts + this._z.getOffset(ts));
        }
        return this._.units;
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
        return this._l;
    }

    /** Set the DateTime's locale (returns a new DateTime) */
    setLocale(locale: Locale | string): DateTime {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region TimeZone
    /** Returns the zone of this DateTime object */
    get zone(): Zone {
        return this._z;
    }

    /** Set the DateTime's zone to UTC (returns a new DateTime) */
    toUtc(): DateTime {
        return this.setZone(Zones.utc);
    }

    /** Set the DateTime's zone to the local zone of the system (returns a new DateTime) */
    toLocal(): DateTime {
        return this.setZone(Zones.local);
    }

    /** Set the DateTime's zone (returns a new DateTime) */
    setZone(zone: Zone | string): DateTime {
        return new DateTime(this.ts, { calendar: this._c, zone, locale: this._l });
    }
    //#endregion

    //#region Calendar

    /**
     * Returns a new date time with the given calendar.
     */
    setCalendar(calendar: Calendar | string): DateTime {
        return new DateTime(this.ts, { ...this.config, calendar });
    }

    /** 
     * Returns the calendar of this DateTime object
     */
    get calendar() {
        return this._c;
    }
    //#endregion

    //#region Misc
    /** Returns whether this DateTime is valid.
     * @public
     */
    get isValid(): boolean {
        if (this._.isValid == null) {
            const { year, month, day } = this.toObject();
            this._.isValid = this._c.isValid(year, month, day);
        }
        return this._.isValid;
    }

    /** Returns whether a variable is a JS-Sugar DateTime or not. */
    static isJssDate(o: any) {
        return o instanceof DateTime;
    }

    /** Clones this DateTime with overrided new unit values. */
    set(newUnits?: DateTimeUnits): DateTime {
        const opts = this.config;

        if (newUnits) {
            return DateTime.fromObject({ ...this.toObject(), ...newUnits }, opts);
        } else {
            return this._.ts ? new DateTime(this._.ts, opts) : DateTime.fromObject(this._.units, opts);
        }
    }
    //#endregion
}
