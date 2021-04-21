import { IsInt, MonthNameFormat, vClsCall, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Zone } from 'src/zone';

/** 
 * An abstract base class for all locales 
 * @public
 * @abstract
 */
export abstract class Locale {
    #name: string;
    #ws: number;

    constructor(resolvedName: string, data: { weekStart: number }) {
        this.#name = resolvedName;

        let ws = data?.weekStart;
        if (!IsInt(ws) || ws < 0 || ws > 6) {
            throw new Error('Invalid week start');
        }
        this.#ws = ws;
    }

    /** Gets the resolved locale name */
    get resolvedName(): string {
        return this.#name;
    }
    
    /** Gets the week strat day (an offset from Sunday). */
    get weekStart(): number {
        return this.#ws;
    }

    /** Returns the month names of the given calendar */
    abstract getMonthNames(calendar: Calendar, format?: MonthNameFormat): string[];

    /** Returns the weekday names */
    abstract getWeekdayNames(format?: WeekdayNameFormat): string[];

    /** Gets the (localized) title of a zone */
    abstract getZoneTitle(zone: Zone, format: 'long' | 'short'): string;
}
