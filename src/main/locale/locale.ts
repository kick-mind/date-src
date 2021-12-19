import { IsInt, MonthNameFormat, WeekdayNameFormat, ZoneTitleFormat } from '../../common';
import { Calendar } from '../calendar';

/** 
 * An abstract base class for all locales 
 * @public
 * @abstract
 */
export abstract class Locale {
    #name: string;
    #ws: number;

    constructor(name: string, options: { weekStart: number }) {
        this.#name = name;

        let ws = options?.weekStart;
        if (!IsInt(ws) || ws < 0 || ws > 6) {
            throw new Error('Invalid week start');
        }
        this.#ws = ws;
    }

    /** Gets the locale name */
    get name(): string {
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
    abstract getZoneTitle(zoneName: string, format: ZoneTitleFormat): string;

    /** Formats a number */
    abstract formatNumber(n: number): string;
}
