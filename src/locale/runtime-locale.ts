import { MonthNameFormat, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';
import { verifyLocale } from '../common/intl';
import { Zone } from '../zone';

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
let cache: {
    [localeResolvedName: string]: {
        weekday?: {
            [format: string]: string[]
        },
        month?: {
            [calendarType: string]: {
                [format: string]: string[]
            },
        },
        zone?: {
            [zoneId: string]: {
                [format: string]: Intl.DateTimeFormat
            },
        },
    }
} = {};

/** A locale created by using javascript Intl API. */
export class RuntimeLocale extends Locale {
    constructor(name: string | null, data: { weekStart: number }) {
        let { resolvedName } = verifyLocale(name, true, true);
        super(resolvedName, data);
        cache[resolvedName] = cache[resolvedName] || { month: {}, weekday: {}, zone: {} };
    }

    getWeekdayNames(format: WeekdayNameFormat = 'long'): string[] {
        let name = this.resolvedName;
        let res = cache[name].weekday[format];
        if (!res) {
            // create/cache weekday names
            let f = new Intl.DateTimeFormat(name, { weekday: format });
            res = [];
            let day = new Date(2021, 4, 28); // Sunday
            for (let i = 0; i < 7; i++) {
                res[(i + this.weekStart) % 7] = f.format(day);
                day.setDate(day.getDate() + 1);
            }
            cache[name].weekday[format] = res;
        }

        return res;
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        let name = this.resolvedName,
            ct = calendar.type,
            m = cache[name].month;

        if (!m[ct]) {
            if (!isSupportedCalendar(ct)) {
                throw new Error('Unsupported calendar.');
            }
            m[ct] = {};
        }
        let res = m[ct][format];

        if (!res) {
            // create/cache month names
            res = [];
            let f = new Intl.DateTimeFormat(name, { calendar: ct, month: format } as any),
                now = calendar.getUnits(new Date().valueOf()),
                firstDayOfMonthTs = calendar.getTimestamp({ ...now, month: 1, day: 1 });
            for (let i = 0; i < 12; i++) {
                res.push(f.format(new Date(firstDayOfMonthTs)));
                firstDayOfMonthTs = calendar.add(firstDayOfMonthTs, { month: 1 });
            }
            m[ct][format] = res;
        }

        return res;
    }

    getZoneName(zone: Zone, format: 'long' | 'short'): string {
        let name = this.resolvedName,
            zId = zone.name,
            cacheZone = cache[name].zone;
        cacheZone[zId] = cacheZone[zId] || {};
        let formatter = cacheZone[zId][format];
        if (!formatter) {
            cacheZone[zId][format] = formatter = new Intl.DateTimeFormat([name], { timeZone: zId, timeZoneName: format });
        }

        return formatter.formatToParts(new Date()).find(m => m.type.toLowerCase() === 'timezonename').value;
    }
}
