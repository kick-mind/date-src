import { MonthNameFormat, WeekdayNameFormat } from 'src/common';
import { Calendar2 } from '../calendar';


/** An abstract base class for all locales (PackageLocale, SystemLocale) */
export abstract class Locale {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    /** Gets the locale ID */
    get id() {
        return this._id;
    }

    /** Gets the week strat day */
    abstract get weekStart(): number;

    /** Returns the month names of the given calendar */
    abstract monthNames(calendar: Calendar2, format?: MonthNameFormat): string[];

    /** Returns the weekday names */
    abstract weekdayNames(format?: WeekdayNameFormat): string[];
}

