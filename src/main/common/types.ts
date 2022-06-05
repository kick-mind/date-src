/**
 * @internal
 * @module 
 */

 import { Calendar } from '../calendar';
 import { Locale } from '../locale';
 import { Zone } from '../zone';
 
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
 

/** DateTime units. */
export interface DateTimeUnits {
    /** Year */
    year?: number;
    /** Month */
    month?: number;
    /** Day */
    day?: number;
    /** Hour */
    hour?: number;
    /** Minute */
    minute?: number;
    /** Second */
    second?: number;
    /** Millisecond */
    ms?: number;
}

/** Time units. */
export interface TimeUnits {
    /** Hour */
    hour?: number;
    /** Minute */
    minute?: number;
    /** Second */
    second?: number;
    /** Millisecond */
    ms?: number;
}

/** Weekday name format */
export type WeekdayNameFormat = 'long' | 'short' | 'narrow';

/** Month name format */
export type MonthNameFormat = 'long' | 'short' | 'narrow';

/** Zone title format */
export type ZoneTitleFormat = 'long' | 'short';
