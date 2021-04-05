import { IsInt, MonthNameFormat, vClsCall, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Zone } from 'src/zone';


/** An abstract base class for all locales (PackageLocale, SystemLocale) */
export abstract class Locale {
    private _id: string;
    private _ws: number;

    constructor(id: string, data: { weekStart: number }) {
        this._id = id;
        vClsCall(this, Locale);

        let ws = data?.weekStart;
        if (!IsInt(ws) || ws < 0 || ws > 6) {
            throw new Error('Invalid week start');
        }
        this._ws = ws;
    }

    /** Gets the resolved locale ID */
    get resolvedId(): string {
        return this._id;
    }

    /** Gets the week strat day (an offset from Sunday). */
    get weekStart(): number {
        return this._ws;
    }

    /** Returns the month names of the given calendar */
    abstract getMonthNames(calendar: Calendar, format?: MonthNameFormat): string[];

    /** Returns the weekday names */
    abstract getWeekdayNames(format?: WeekdayNameFormat): string[];

    
    /** Gets the name of a zone */
    abstract getZoneName(zone: Zone, format: 'long' | 'short'): string;
}

