import { Calendar } from './calendar';
import { Locale } from './locale';
import { Zone } from './zone';

/** 
 * A calendar object or a calendar id
 */
export type CalendarSpecifier = Calendar | string;

/** 
 * A zone object or a zone name 
 */
export type ZoneSpecifier = Zone | string;

/** 
 * A locale object or a locale name
 */
export type LocaleSpecifier = Locale | string;
