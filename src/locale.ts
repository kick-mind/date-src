export interface Locale {
    /** Locale name */
    name: string;

    week: {
        /** The first day of the week */
        first: number;

        /** An array of the weekday names */
        days: string[];
    }

    calendars: {
        [calendar: string]: {
            /** An array of the month names */
            months: string[];
        }
    };
}
