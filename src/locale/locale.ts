/** Locale data */
export interface LocaleData {
    /** Locale name */
    name: string;

    /** The first day of the week */
    weekStart: number;

    /** weekday names */
    weekdays: Array<Array<string>>;

    /** month names */
    months: {
        [calendarName: string]: Array<Array<string>>;
    };
}

/** An abstract base class for all locales (PackageLocale, SystemLocale) */
export abstract class Locale {
    private _data: LocaleData;

    constructor(data: LocaleData) {
        this._data = data;
        Object.freeze(data); // TODO: Do a deep data freezing!
    }
<<<<<<< HEAD
    
=======

    /** Gets the locale ID */
    get id() {
        return this._data.id;
    }

    /** Gets the week strat day */
    get weekStart() {
        return this._data.weekStart;
    }

    /** Returns the month name */
    monthName(month: number, calendarName: string, abbr = false) {
        return this._data.months[calendarName][abbr ? 1 : 0][month - 1];
    }

    /** Returns the weekday name */
    weekdayName(weekday: number, abbr: 'none' | 'short' | 'min' = 'none') {
        const idx = abbr == 'min' ? 2 : (abbr == 'short' ? 1 : 0);
        return this._data.months[idx][weekday - 1];
    }
>>>>>>> 544fa44de2e3f555a19f758763a514b8d5efc87c
}

