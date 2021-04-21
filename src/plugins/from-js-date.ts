import { Calendars } from '../calendar';
import { LocaleSpecifier, ZoneSpecifier } from '../common';
import { DateTime } from '../date-time';

/** 
 * Creates a DateTime from a Javascript Date object
 * @public
 */
export function fromJsDate(date: Date, opts?: { zone?: ZoneSpecifier, locale?: LocaleSpecifier }) {
    return new DateTime(date.valueOf(), { ...opts, calendar: Calendars.find('gregorian', { throwError: true }) });
}
