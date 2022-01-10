import { ZoneSpecifier, Calendars, LocaleSpecifier, DateTime, CalendarSpecifier, Calendar, FixedZone, Zones, Zone, Locales } from '../main';

/** 
 * Creates a DateTime from a Javascript Date object
 * @public
 * @param date JavaScript Date
 */
export function fromJsDate(date: Date, options?: { zone?: ZoneSpecifier, locale?: LocaleSpecifier }) {
    const c = Calendars.findByType('gregory')[0];
    if (!c) {
        throw Error('No gregorian calendar found.');
    }

    // The time-zone offset is the difference, in minutes, between UTC and local time.
    // Note that this means that the offset is positive if the local timezone is behind UTC and negative if it is ahead.
    let z = Zones.resolve(options?.zone || options?.zone === 0 ? options.zone : -1 * date.getTimezoneOffset());

    return new DateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
        { calendar: c, zone: z, locale: options?.locale });
}
