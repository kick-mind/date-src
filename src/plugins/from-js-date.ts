import { ZoneSpecifier, Calendars, LocaleSpecifier, DateTime } from '../main';

/** 
 * Creates a DateTime from a Javascript Date object
 * @public
 */
export function fromJsDate(date: Date, opts?: { zone?: ZoneSpecifier, locale?: LocaleSpecifier }) {
    return new DateTime(date.valueOf(), { ...opts, calendar: Calendars.find('gregorian') });
}
