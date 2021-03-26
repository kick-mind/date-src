import { MonthNameFormat, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';

let computeFormatIndex = (f: MonthNameFormat) => f == 'narrow' ? 2 : (f == 'short' ? 1 : 0);

/** Locale data */
export interface LocaleData {
    /** Locale identifier */
    id: string;

    /** The first day of the week */
    weekStart: number;

    /** weekday names */
    weekdays: Array<Array<string>>;

    /** month names */
    months: {
        [calendarName: string]: Array<Array<string>>;
    };
}

/** A locale provided in the package (file-based locale). */
export class FileLocale extends Locale {
    private _data: LocaleData;

    constructor(data: LocaleData) {
        super(data.id);
        this._data = data;
        Object.freeze(data); // TODO: Do a deep data freezing!
    }

    /** Gets the locale ID */
    get id() {
        return this._data.id;
    }

    /** Gets the week strat day */
    get weekStart() {
        return this._data.weekStart;
    }

    monthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        const idx = computeFormatIndex(format);
        return [...this._data.months[calendar.type][idx]];
    }

    weekdayNames(format?: WeekdayNameFormat): string[] {
        const idx = computeFormatIndex(format);
        return [...this._data.weekdays[idx]];
    }
}
