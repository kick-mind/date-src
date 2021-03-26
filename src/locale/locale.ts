import { IsInt, MonthNameFormat, verifyClassCall, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';


/** An abstract base class for all locales (PackageLocale, SystemLocale) */
export abstract class Locale {
    private _id: string;
    private _ws: number;

    constructor(id: string, data: { weekStart: number }) {
        this._id = id;
        verifyClassCall(this, Locale);

        let ws = data?.weekStart;
        if (!ws || !IsInt(ws) || ws < 0 || ws > 6) {
            throw new Error('Invalid week start');
        }
        this._ws = ws;
    }

    /** Gets the locale ID */
    get id() {
        return this._id;
    }

    /** Gets the week strat day (an offset from Sunday). */
    get weekStart(): number {
        return this._ws;
    }

    /** Returns the month names of the given calendar */
    abstract monthNames(calendar: Calendar, format?: MonthNameFormat): string[];

    /** Returns the weekday names */
    abstract weekdayNames(format?: WeekdayNameFormat): string[];
}

