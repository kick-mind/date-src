import { IsInt, isSupportedLocale, MonthNameFormat, verifyClassCall, verifyLocale, verifyType, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';

function isSupportedCalendar(calendarName: string) {
    return [
        'buddhist',
        'chinese',
        'coptic',
        'ethiopia',
        'ethiopic',
        'gregory',
        'hebrew',
        'indian',
        'islamic',
        'iso8601',
        'japanese',
        'persian',
        'roc'
    ].findIndex(x => x === calendarName) > -1;
}

// Cache
let _: {
    [localeId: string]: {
        weekday?: {
            [format: string]: string[]
        },
        month?: {
            [calendarType: string]: {
                [format: string]: string[]
            },
        },
    }
} = {};

/** A locale created by using javascript Intl API. */
export class JsLocale extends Locale {
    constructor(id: string, data: { weekStart: number }) {
        super(id, data);
        verifyClassCall(this, JsLocale);
        verifyLocale(id);
        _[id] = _[id] ?? { month: {}, weekday: {} };
    }

    getWeekdayNames(format: WeekdayNameFormat = 'long'): string[] {
        let id = this.id;
        let res = _[id].weekday[format];
        if (!res) {
            // create/cache weekday names
            let f = new Intl.DateTimeFormat(id, { weekday: format });
            res = [];
            let day = new Date(2021, 4, 28); // Sunday
            for (let i = 0; i < 7; i++) {
                res[(i + this.weekStart) % 7] = f.format(day);
                day.setDate(day.getDate() + 1);
            }
            _[id].weekday[format] = res;
        }

        return res;
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        let id = this.id, ct = calendar.type;
        let cm = _[id].month[ct],
            res = cm && cm[format];

        if (!res) {
            if (isSupportedCalendar(ct)) {
                throw new Error('Unsupported calendar.');
            }

            // create/cache month names
            _[id].month[ct] = cm ?? {};
            res = [];
            let f = new Intl.DateTimeFormat(id, { calendar: ct, month: format } as any),
                now = calendar.getUnits(new Date().valueOf()),
                firstDayOfMonthTs = calendar.getTimestamp({ ...now, month: 1, day: 1 });
            for (let i = 0; i < 12; i++) {
                res.push(f.format(new Date(firstDayOfMonthTs)));
                firstDayOfMonthTs += calendar.add(firstDayOfMonthTs, { month: 1 });
            }
            _[id].month[calendar.type][format] = res;
        }

        return res;
    }
}
