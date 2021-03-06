export interface Locale {
    name: string;
    calendars: {
        [calendar: string]: {
            weekDays: string[];
            months: string[];
        }
    };
}
