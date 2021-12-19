import { deepFreeze, MonthNameFormat, WeekdayNameFormat, ZoneTitleFormat } from '../../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';

let getFormatIndex = (f: MonthNameFormat) => f == 'narrow' ? 2 : (f == 'short' ? 1 : 0);

/** Static Locale data */
export interface StaticLocaleData {
    /** Locale name */
    name: string;

    /** The first day of the week */
    weekStart: number;

    /** Weekday names */
    weekdays: Array<Array<string>>;

    /** Month names */
    months: {
        [calendarType: string]: Array<Array<string>>;
    };

    /** Zone titles */
    zones?: {
        [zoneName: string]: Array<string>; // zoneName: ['short title', 'long title']
    };
}

/** A file-based Locale. */
export class StaticLocale extends Locale {
    #data: StaticLocaleData;

    constructor(data: StaticLocaleData) {
        super(data.name, { weekStart: data.weekStart });
        this.#data = data;
        deepFreeze(data);
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        const idx = getFormatIndex(format);
        try {
            const names = [...this.#data.months[calendar.type][idx]];
            if (Array.isArray(names)) {
                return names;
            }
            throw Error();
        } catch {
            throw Error('Missing month names');
        }
    }

    getWeekdayNames(format: WeekdayNameFormat = 'long'): string[] {
        const idx = getFormatIndex(format);
        return [...this.#data.weekdays[idx]];
    }

    getZoneTitle(zoneName: string, format: ZoneTitleFormat = 'long'): string {
        if (this.#data?.zones?.hasOwnProperty(zoneName)) {
            return this.#data?.zones[zoneName][format === 'short' ? 0 : 1];
        }
    }

    formatNumber(n: number): string {
        throw new Error('Not supported in this version.');
    }
}
