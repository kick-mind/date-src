import { Calendar, Calendars } from "../calendar";
import { Zone, Zones } from "../zone";
import { Locale, Locales } from "../locale";
import {
  CalendarSpecifier,
  DateTimeUnits,
  IsInt,
  IsObj,
  IsStr,
  LocaleSpecifier,
  padNum,
  throwInvalidParam,
  vClsCall,
  vObj,
  WeekdayNameFormat,
  ZoneSpecifier,
} from "../common";

/** Is a non-negetive integer? */
const II = (x: any) => IsInt(x) && x >= 0;

/** Is a non-negetive integer or null/undefined? */
const IIN = (x: any) => x == null || II(x);

/** Is object? */
const IO = IsObj;

/** Is object or null ? */
const ION = (x: any) => x == null || IO(x);

/** DateTime create options. */

export interface DateTimeCreateOptions {
  calendar?: CalendarSpecifier; // A Calendar object or Calendar ID
  zone?: ZoneSpecifier; // | number :: zone offset (for next versions)
  locale?: LocaleSpecifier;
}

/**
 * JS-Sugar DateTime.
 * @public
 */

/**
 * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
 *
 * A DateTime comprises of:
 * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
 * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
 * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
 *
 * Here is a brief overview of the most commonly used functionality it provides:
 *
 * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link local}, {@link utc}, and (most flexibly) {@link fromObject}. To create one from a standard string format, use {@link fromISO}, {@link fromHTTP}, and {@link fromRFC2822}. To create one from a custom string format, use {@link fromFormat}. To create one from a native JS date, use {@link fromJSDate}.
 * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link toObject}), use the {@link year}, {@link month},
 * {@link day}, {@link hour}, {@link minute}, {@link second}, {@link millisecond} accessors.
 * * **Week calendar**: For ISO week calendar attributes, see the {@link weekYear}, {@link weekNumber}, and {@link weekday} accessors.
 * * **Configuration** See the {@link locale} and {@link numberingSystem} accessors.
 * * **Transformation**: To transform the DateTime into other DateTimes, use {@link set}, {@link reconfigure}, {@link setZone}, {@link setLocale}, {@link plus}, {@link minus}, {@link endOf}, {@link startOf}, {@link toUTC}, and {@link toLocal}.
 * * **Output**: To convert the DateTime to other representations, use the {@link toRelative}, {@link toRelativeCalendar}, {@link toJSON}, {@link toISO}, {@link toHTTP}, {@link toObject}, {@link toRFC2822}, {@link toString}, {@link toLocaleString}, {@link toFormat}, {@link toMillis} and {@link toJSDate}.
 *
 * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
 */
export class DateTime {
  /**
   * @access private
   */
  #c: Calendar;
  #z: Zone;
  #l: Locale;
  #units: DateTimeUnits;
  #ts: number; // Timestamp (UTC)

  /**
   * Creates a new DateTime object.
   * @constructor
   */
  constructor();
  constructor(opts: DateTimeCreateOptions);
  constructor(
    year: number,
    month: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
    ms?: number,
    opts?: DateTimeCreateOptions
  );
  constructor(
    opts: DateTimeCreateOptions,
    year: number,
    month: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
    ms?: number
  );
  constructor(timestamp: number, opts?: DateTimeCreateOptions);
  constructor() {
    vClsCall(this, DateTime);
    let ts: number;
    let year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
      ms: number;
    let opts: DateTimeCreateOptions;

    // Resolve constructor parameters
    const a = arguments,
      a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
    let now = () => new Date().valueOf();
    if (a.length == 0) {
      // 1'st overload
      ts = now();
    } else if (a.length == 1 && IO(a0)) {
      // 2'nd overload
      ts = now();
      opts = a0;
    } else if (
      II(a0) &&
      II(a1) &&
      IIN(a2) &&
      IIN(a3) &&
      IIN(a4) &&
      IIN(a4) &&
      IIN(a6) &&
      ION(a7)
    ) {
      // 3'nd overload
      year = a0;
      month = a1;
      day = a2;
      hour = a3;
      minute = a4;
      second = a5;
      ms = a6;
      opts = a7;
    } else if (
      IO(a0) &&
      II(a1) &&
      II(a2) &&
      IIN(a3) &&
      IIN(a4) &&
      IIN(a5) &&
      IIN(a6) &&
      IIN(a7)
    ) {
      // 4'rd overload
      opts = a0;
      year = a1;
      month = a2;
      day = a3;
      hour = a4;
      minute = a5;
      second = a6;
      ms = a7;
    } else if (IsInt(a0) && ION(a1)) {
      // 5'th overload (create by timestamp)
      ts = a0;
      opts = a1;
    } else {
      throwInvalidParam();
    }

    // Set DateTime value
    if (ts) {
      this.#ts = ts;
    } else {
      this.#units = {
        year,
        month,
        day: day == null ? 1 : day,
        hour: hour || 0,
        minute: minute || 0,
        second: second || 0,
        ms: ms || 0,
      };
    }

    const o = { throwError: true };

    // Resolve zone
    let z: any = opts?.zone;
    if (!z) {
      z = Zones.local;
    } else if (IsStr(z)) {
      z = Zones.resolve(z, o);
    } else {
      vObj(z, Zone, true, "Invalid zone");
    }
    this.#z = z;

    // Resolve locale
    let l: any = opts?.locale;
    if (!l) {
      l = Locales.default;
    } else if (IsStr(l)) {
      l = Locales.resolve(l, { weekStart: 0, throwError: true });
    } else {
      vObj(l, Locale, true, "Invalid locale");
    }
    this.#l = l;

    // Resolve calendar
    let c: any = opts?.calendar;
    if (!c) {
      c = Calendars.default;
    } else if (IsStr(c)) {
      c = Calendars.find(c, o);
    } else {
      vObj(c, Calendar, true, "Invalid calendar");
    }
    this.#c = c;
  }

  //#region Get
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
    if (this.#ts == null) {
      const zoneTs = this.#c.getTimestamp(this.#units);
      this.#ts = zoneTs - this.#z.getOffset(zoneTs) * 1000 * 60;
    }
    return this.#ts;
  }

  /**
   * Returns the configurations of this object (calandar, zone and locale).
   * @public
   */
  get config(): { calendar: Calendar; zone?: Zone; locale?: Locale } {
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
  //#endregion

  //#region Locale
  /**
   * Get the locale of a DateTime, such 'en-GB'.
   * @public
   */
  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month, 1-indexed
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                            //~> now
   * @example DateTime.local(2017)                        //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                     //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12)                 //~> 2017-03-12T00:00:00
   * @example DateTime.local(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765) //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */
  get locale(): Locale {
    return this.#l;
  }

  /**
   * Sets the DateTime's locale (returns a new DateTime)
   * @public
   */
  toLocale(locale: LocaleSpecifier): DateTime {
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
  toZone(zone: ZoneSpecifier): DateTime {
    return new DateTime(this.ts, { calendar: this.#c, zone, locale: this.#l });
  }
  //#endregion

  //#region Calendar
  /**
   * Returns a new date time with the given calendar.
   * @public
   */
  to(calendar: CalendarSpecifier): DateTime {
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
   * Clones this DateTime with overwriten new unit values.
   * @public
   */
  clone(newUnits?: DateTimeUnits): DateTime {
    if (this.#ts) {
      return new DateTime(this.#ts, this.config);
    } else {
      const u = { ...this.#units, ...newUnits };
      return new DateTime(
        u.year,
        u.month,
        u.day,
        u.hour,
        u.minute,
        u.second,
        u.ms,
        this.config
      );
    }
  }

  /**
   * Clones this DateTime with time units (hour, minute, second, ms) set to zero.
   * @public
   */
  get date(): DateTime {
    const o = this.toObject();
    return new DateTime(this.config, o.year, o.month, o.day);
  }

  /**
   * Returns an object with the values of this DateTime.
   * @public
   */
  toObject(): DateTimeUnits {
    if (this.#units == null) {
      let offset = this.#z.getOffset(this.#ts) * 60 * 1000;
      this.#units = this.#c.getUnits(this.#ts - offset);
    }
    return this.#units;
  }
  //#endregion
}
