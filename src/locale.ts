export interface Locale {
    /** Locale name */
    name: string;

    /** The first day of the week */
    weekStart: number;

    /** weekday names */
    weekdays: Array<Array<string>>;

    /** month names */
    months: {
        [calendar: string]: Array<Array<string>>;
    }
}
