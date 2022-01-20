/**
 * @category Core
 * @module DateTime
 */

import {
  DateTimeUnits,
  IsInt,
  IsObj,
  IsStr,
  throwInvalidParam,
  vClsCall,
  vObj,
} from '../common';
import { CalendarSpecifier, LocaleSpecifier, ZoneSpecifier, Locale, Locales, Zone, Zones, Calendar, Calendars } from '.';

/** Is an integer? */
const II = (x: any) => IsInt(x);

/** Is an integer or null/undefined? */
const IIN = (x: any) => x == null || II(x);

/** Is object? */
const IO = IsObj;

/** Is object or null ? */
const ION = (x: any) => x == null || IO(x);

/** DateTime create options. */
export interface DateTimeCreationOptions {
  /** Calendar specifier */
  calendar?: CalendarSpecifier;
  /** Zone specifier */
  zone?: ZoneSpecifier;
  /** Locale specifier */
  locale?: LocaleSpecifier;
}

/** DateTime configuration. */
export interface DateTimeConfiguration {
  calendar: Calendar;
  zone: Zone;
  locale: Locale;
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
    } else if (II(a0) && ION(a1)) {
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

    const o = { strict: true };

    // Resolve zone
    this.#z = Zones.resolve(opts?.zone || Zones.local, { strict: true });

    // Resolve locale
    this.#l = Locales.resolve(opts?.locale || Locales.default, { strict: true });

    // Resolve calendar
    let c: any = opts?.calendar;
    if (!c) {
      if (!Calendars.default) {
        throw Error('No calendar is added to the application.');
      }
      c = Calendars.default;
    } else if (IsStr(c)) {
      c = Calendars.find(c, o);
    } else {
      vObj(c, Calendar, true, 'Invalid calendar');
    }
    this.#c = c;
  }

  //#region Get
  /**
   * Gets the year.
   * @public
   */
  get year(): number {
    return this.toObject().year;
  }

  /** 
   * Gets the month (1-12).
   * @public
   */
  get month(): number {
    return this.toObject().month;
  }

  /**
   * Gets the day of the month (1 to 31).
   * @public
   */
  get day(): number {
    return this.toObject().day;
  }

  /**
   * Gets the hour of the day (0 to 23).
   * @public
   */
  get hour(): number {
    return this.toObject().hour;
  }

  /**
   * Gets the minute of the hour (0 to 59).
   * @public
   */
  get minute(): number {
    return this.toObject().minute;
  }

  /**
   * Gets the second of the minute (0 to 59).
   * @public
   */
  get second(): number {
    return this.toObject().second;
  }

  /**
   * Gets the millisecond of the second (0 to 999).
   * @public
   */
  get ms(): number {
    return this.toObject().ms;
  }

  /**
   * Gets the timestamp of this object.
   * @public
   * @description This value is usually the number of milliseconds since January 1, 1970 (EPOCH) and 
   * it can be a positive or negetive number (it depends on the implementation of the Calendar).
   */
  get ts(): number {
    if (this.#ts == null) {
      const zoneTs = this.#c.getTimestamp(this.#units);
      this.#ts = zoneTs - this.#z.getOffset(zoneTs) * 1000 * 60;
    }
    return this.#ts;
  }

  /**
   * Returns a clone of the configurations of this object (calandar, zone and locale).
   * @public
   */
  get config(): DateTimeConfiguration {
    return { calendar: this.#c, zone: this.#z, locale: this.#l };
  }
  //#endregion

  //#region Calculation
  /**
   * Adds a period of time to this DateTime and returns the resulting DateTime.
   * @public
   * @param units DateTimeUnits
   */
  add(units: DateTimeUnits): DateTime {
    return new DateTime(this.#c.add(this.ts, units), this.config);
  }

  /**
   * Subtracts a period of time from this DateTime and returns the resulting DateTime.
   * @public
   * @param units DateTimeUnits
   */
  subtract(units: DateTimeUnits): DateTime {
    return new DateTime(this.#c.subtract(this.ts, units), this.config);
  }
  //#endregion

  //#region Locale
  /**
   * Gets the locale of a DateTime.
   * @public
   */
  get locale(): Locale {
    return this.#l;
  }

  /**
   * Returns a new DateTime equivalent with this DateTime but with a different Locale
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
   * Returns a new DateTime equivalent with this DateTime but with UTC as time-zone
   * @public
   */
  toUtc(): DateTime {
    return this.toZone(Zones.utc);
  }

  /**
   * Returns a new DateTime equivalent with this DateTime but with local time-zone
   * @public
   */
  toLocal(): DateTime {
    return this.toZone(Zones.local);
  }

  /**
   * Returns a new DateTime equivalent with this DateTime but with a different Zone
   * @public
   */
  toZone(zone: ZoneSpecifier): DateTime {
    return new DateTime(this.ts, { calendar: this.#c, zone, locale: this.#l });
  }
  //#endregion

  //#region Calendar
  /**
   * Returns a new DateTime equivalent with this DateTime but with a different Calendar
   * @public
   * @param calendar CalendarSpecifier
   */
  to(calendar: CalendarSpecifier): DateTime {
    return new DateTime(this.ts, { ...this.config, calendar });
  }

  /**
   * Gets the calendar of this DateTime
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
    const u = { ...this.toObject(), ...newUnits };
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

  /**
   * Clones this DateTime with "time units" (hour, minute, second, ms) set to zero.
   * @public
   */
  get date(): DateTime {
    const o = this.toObject();
    return new DateTime(this.config, o.year, o.month, o.day);
  }

  /**
   * Returns the units of this DateTime object.
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
