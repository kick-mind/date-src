import { deepFreeze, MonthNameFormat, WeekdayNameFormat, ZoneNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';
import { Zone } from '../zone';

let getFormatIndex = (f: MonthNameFormat) => f == 'narrow' ? 2 : (f == 'short' ? 1 : 0);

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
        [calendarType: string]: Array<Array<string>>;
    };
}

/** A locale with predefined(fixed) data. */
export class StaticLocale extends Locale {
    #data: LocaleData;

    constructor(data: LocaleData) {
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

    getZoneTitle(zone: Zone, format: ZoneNameFormat = 'long'): string {
        return zone.name;
    }
}
