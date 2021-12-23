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
