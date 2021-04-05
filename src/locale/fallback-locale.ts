import { MonthNameFormat, WeekdayNameFormat } from '../common';
import { Calendar } from '../calendar';
import { Locale } from './locale';
import { Zone } from 'src/zone';

const m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ms = m.map(x => x.substring(0, 2));
const mn = m.map(x => x[0]);
const w = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ws = w.map(x => x.substring(0, 2));
const wn = w.map(x => m[0]);
const cache = {
    m: {
        long: m,
        short: ms,
        narrow: mn,
    },
    w: {
        long: w,
        short: ws,
        narrow: wn,
    }
};

/** A fallback locale. */
export class FallbackLocale extends Locale {
    constructor() {
        super('Fallback', { weekStart: 0 });
    }

    getWeekdayNames(format: WeekdayNameFormat = 'long'): string[] {
        return [...cache.w[format]];
    }

    getMonthNames(calendar: Calendar, format: MonthNameFormat = 'long'): string[] {
        if (calendar.type != 'gregory') {
            throw new Error('only greogrian calendar is supported');
        }
        return [...cache.m[format]];
    }

    getZoneName(zone: Zone, format: 'long' | 'short'): string {
        return zone.id;
    }
}
