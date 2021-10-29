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

/** Weekday name format */
export type WeekdayNameFormat = 'long' | 'short' | 'narrow';

/** Month name format */
export type MonthNameFormat = 'long' | 'short' | 'narrow';

/** Zone title format */
export type ZoneTitleFormat = 'long' | 'short';
