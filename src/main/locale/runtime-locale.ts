/**
 * @category Locale
 * @module RuntimeLocale
 */


import { MonthNameFormat, WeekdayNameFormat, ZoneTitleFormat } from '../../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';
import { verifyLocale } from '../../common';

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

/** 
 * A locale created by using javascript Intl API.
 * @class
 */
export class RuntimeLocale extends Locale {
    #resolvedName: string;
    #isSystemLocale: boolean;

    constructor(name: string, options: { weekStart: number }) {
        super(name, options);
        this.#isSystemLocale = name === 'system';
        let { resolvedName } = verifyLocale(this.#isSystemLocale ? null : name, true, true);
        this.#resolvedName = resolvedName;
        cache[resolvedName] = cache[resolvedName] || { month: {}, weekday: {}, zone: {} };
    }

    /** 
     * Gets the resolved name of this locale.
     */
    get resolvedName() {
        return this.#resolvedName;
    }

    getWeekdayNames(format: WeekdayNameFormat = 'long', weekStart?: number): string[] {
        let rName = this.#resolvedName;
        let ws = typeof weekStart === 'number' ? weekStart : this.weekStart;
        let f = new Intl.DateTimeFormat(rName, { weekday: format });
        let day = new Date(2021, 4, 2); // Sunday
        const res = [];

        day.setDate(day.getDate() + ws);
        for (let i = 0; i < 7; i++) {
            res[i] = f.format(day);
            day.setDate(day.getDate() + 1);
        }

        return res;
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        let name = this.#resolvedName,
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

    getZoneTitle(zoneName: string, format: ZoneTitleFormat = 'long'): string {
        let rName = this.#resolvedName,
            cacheZone = cache[rName].zone;
        cacheZone[zoneName] = cacheZone[zoneName] || {};
        let formatter = cacheZone[zoneName][format];
        if (!formatter) {
            try {
                cacheZone[zoneName][format] = formatter = new Intl.DateTimeFormat([rName], { timeZone: zoneName, timeZoneName: format });
            } catch {
                throw Error('IANA zone name is invalid or not supported.');
            }
        }

        return formatter.formatToParts(new Date()).find(m => m.type.toLowerCase() === 'timezonename').value;
    }

    formatNumber(n: number, options?: { minimumIntegerDigits?: number }): string {
        const res =  new Intl.NumberFormat(this.#resolvedName, {
            style: 'decimal',
            useGrouping: false,
            minimumIntegerDigits: options?.minimumIntegerDigits ?? 1
        }).format(n);

        return res;
    }
}
