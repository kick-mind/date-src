import { Calendar } from './calendar';
import { Locale } from './locale';
import { Zone } from './zone';

/** 
 * A calendar object or a calendar id
 */
export type CalendarSpecifier = Calendar | string;

/** 
 * A zone object, an IANA zone name or a time-zone offset (in minutes)
 */
export type ZoneSpecifier = Zone | string | number;

/** 
 * A locale object or a locale name
 */
export type LocaleSpecifier = Locale | string | {
    name: string,
    weekStart: number
};
