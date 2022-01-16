import { Calendars, DateTime } from '../main';
import { format, Formats } from './format';

/** 
 * Returns an ISO 8601-compliant string representation of this DateTime.
 * @public
 * @param date - DateTime
 * @return ISO 8601 compliant string representation of the given DateTime
 */
export function formatIso(date: DateTime): string {
    date = date.toLocale('en');
    if (date.calendar.type !== 'gregory') {
        const gregorianCalendars = Calendars.findByType('gregory');
        if (gregorianCalendars.length == 0) {
            throw Error('A gregorian calendar is needed to format DateTime to ISO-8601');
        }
        date = date.to(gregorianCalendars[0]);
    }

    return format(date, Formats.iso);   
}
