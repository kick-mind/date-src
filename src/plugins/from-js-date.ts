import { ZoneSpecifier, Calendars, LocaleSpecifier, DateTime, CalendarSpecifier, Calendar, FixedZone, Zones, Zone, Locales } from '../main';

/** 
 * Creates a DateTime from a Javascript Date object
 * @public
 */
export function fromJsDate(date: Date, options?: { zone?: ZoneSpecifier, locale?: LocaleSpecifier }) {
    const c = Calendars.findByType('gregory')[0];
    if (!c) {
        throw Error('No gregorian calendar found.');
    }

    const d = new Date(date);
    let z = Zones.resolve(options?.zone || options?.zone === 0 ? options.zone : d.getTimezoneOffset());

    return new DateTime(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds(),
        { calendar: c, zone: z, locale: options?.locale });
}
