import { Locale } from '../locale';
import { Zone } from '../zone';
import { Calendar } from '../calendar';


/** DateTime units. */
export interface DateTimeUnits {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    ms?: number;
}

/** Time units. */
export interface TimeUnits{
    hour?: number;
    minute?: number;
    second?: number;
    ms?: number;
}

/** A calendar object or a calendar id */
export type CalendarSpecifier = Calendar | string;

/** A zone object or a zone name */
export type ZoneSpecifier = Zone | string;

/** A locale object or a locale name */
export type LocaleSpecifier = Locale | string;

/** Weekday name format */
export type WeekdayNameFormat = 'long' | 'short' | 'narrow';

/** Month name format */
export type MonthNameFormat = 'long' | 'short' | 'narrow';

/** Zone name format */
export type ZoneNameFormat = 'long' | 'short';
