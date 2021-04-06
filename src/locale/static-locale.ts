import { MonthNameFormat, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';
import { Zone } from '../zone';

let getFormatIndex = (f: MonthNameFormat) => f == 'narrow' ? 2 : (f == 'short' ? 1 : 0);

/** Locale data */
export interface LocaleData {
    /** Locale identifier (should be unique) */
    id: string;

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
    private _data: LocaleData;

    constructor(data: LocaleData) {
        super(data.id, data.name, { weekStart: data.weekStart });
        this._data = data;
        Object.freeze(data); // TODO: Do a deep data freezing!
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        const idx = getFormatIndex(format);
        try {
            const names = [...this._data.months[calendar.type][idx]];
            if (Array.isArray(names)) {
                return names;
            }
            throw Error();
        } catch {
            throw Error('Month names for this calendar is missing');
        }
    }

    getWeekdayNames(format?: WeekdayNameFormat): string[] {
        const idx = getFormatIndex(format);
        return [...this._data.weekdays[idx]];
    }

    getZoneName(zone: Zone, format: 'long' | 'short'): string {
        return zone.id;
    }
}
