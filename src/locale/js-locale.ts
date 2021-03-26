import { IsInt, MonthNameFormat, verifyClassCall, verifyLocale, verifyType, WeekdayNameFormat } from 'src/common';
import { Calendar } from '../calendar';
import { Locale } from './locale';

// Weekday names cache
let weekDays: {
    [localeId: string]: {
        long?: string[],
        short?: string[],
        narrow?: string[],
    },
} = {};

// Month names cache
let monthNames: {
    [localeId: string]: {
        [calendarType: string]: {
            long?: string[],
            short?: string[],
            narrow?: string[],
        },
    }
} = {};

// Date formatters cache
let formatters: {
    [localeId: string]: {
        weekday?: {
            long?: Intl.DateTimeFormat,
            short?: Intl.DateTimeFormat,
            narrow?: Intl.DateTimeFormat,
        },
        month?: {
            long?: Intl.DateTimeFormat,
            short?: Intl.DateTimeFormat,
            narrow?: Intl.DateTimeFormat,
        },
    }
} = {};

/** A locale created by using javascript Intl API. */
export class JsLocale extends Locale {
    constructor(id: string, data: { weekStart: number }) {
        super(id, data);
        verifyClassCall(this, JsLocale);
        verifyLocale(id);
    }

    weekdayNames(format?: WeekdayNameFormat): string[] {
        throw new Error('Method not implemented.');
    }

    monthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        let id = this.id;
        // Find or create/cache a month formatter 
        let lf = formatters[id] || {},
            mf = lf.month || {},
            f = mf[format];
        if (!f) {
            f = new Intl.DateTimeFormat(id, { month: format });
            formatters[id].month[format] = f;
        }

        // Find or create/cache months names
        let localeMonths = monthNames[id] || {},
            calMonths = localeMonths[calendar.type] || {},
            months = calMonths[format];
        if (!months) {
            months = [];
            let now = new Date().valueOf();
            let { year } = calendar.getUnits(now);
            let firstDayOfMonthTs = calendar.getTimestamp({ year, month: 1, day: 1 });
            for (let i = 0; i < 12; i++) {
                months.push(f.format(new Date(firstDayOfMonthTs)));
                firstDayOfMonthTs += calendar.add(firstDayOfMonthTs, { month: 1 });
            }
            monthNames[id][calendar.type][format] = months;
        }

        return months;
    }
}
