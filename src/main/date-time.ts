import { Calendar } from './calendar';
import { Calendars } from './calendar';
import { Zone } from './zone';
import { Zones } from './zone/zones';
import { Locale } from './locale';
import { Locales } from './locale';

import {
  DateTimeUnits,
  IsInt,
  IsObj,
  IsStr,
  padNum,
  throwInvalidParam,
  vClsCall,
  vObj,
  WeekdayNameFormat,
} from '../common';
import { CalendarSpecifier, LocaleSpecifier, ZoneSpecifier } from './common';

/** Is a non-negetive integer? */
const II = (x: any) => IsInt(x) && x >= 0;

/** Is a non-negetive integer or null/undefined? */
const IIN = (x: any) => x == null || II(x);

/** Is object? */
const IO = IsObj;

/** Is object or null ? */
const ION = (x: any) => x == null || IO(x);

/** DateTime create options. */
export interface DateTimeCreationOptions {
  calendar?: CalendarSpecifier; // A Calendar object or Calendar ID
  zone?: ZoneSpecifier; // | number :: zone offset (for next versions)
  locale?: LocaleSpecifier;
}

/**
 * JS-Sugar DateTime.
 * @public
 */
export class DateTime {
  #c: Calendar;
  #z: Zone;
  #l: Locale;
  #ts: number; // Timestamp (UTC)
  #units: DateTimeUnits;

  /**
   * Creates a new DateTime object.
   * @constructor
   */
  constructor();
  constructor(opts: DateTimeCreationOptions);
  constructor(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number, opts?: DateTimeCreationOptions);
  constructor(opts: DateTimeCreationOptions, year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number);
  constructor(timestamp: number, opts?: DateTimeCreationOptions);
  constructor() {
    vClsCall(this, DateTime);
    let ts: number;
    let year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number;
    let opts: DateTimeCreationOptions;

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
    } else if (II(a0) && II(a1) && IIN(a2) && IIN(a3) && IIN(a4) && IIN(a4) && IIN(a6) && ION(a7)) {
      // 3'nd overload
      year = a0;
      month = a1;
      day = a2;
      hour = a3;
      minute = a4;
      second = a5;
      ms = a6;
      opts = a7;
    } else if (IO(a0) && II(a1) && II(a2) && IIN(a3) && IIN(a4) && IIN(a5) && IIN(a6) && IIN(a7)) {
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
      vObj(z, Zone, true, 'Invalid zone');
    }
    this.#z = z;

    // Resolve locale
    let l: any = opts?.locale;
    if (!l) {
      l = Locales.default;
    } else if (IsStr(l)) {
      l = Locales.resolve(l, { weekStart: 0, throwError: true });
    } else {
      vObj(l, Locale, true, 'Invalid locale');
    }
    this.#l = l;

    // Resolve calendar
    let c: any = opts?.calendar;
    if (!c) {
      if (!Calendars.default) {
        throw Error('No calendar is added to the application.');
      }
      c = Calendars.default;      
    } else if (IsStr(c)) {
      c = Calendars.find(c);
    } else {
      vObj(c, Calendar, true, 'Invalid calendar');
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
   * Returns a new date time with the given Calendar.
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
      let u = this.#c.getUnits(this.#ts + offset);
      this.#units = u;
    }
    return this.#units;
  }
  //#endregion
}
