import { padNum } from '../common';
import { DateTime } from '../main';
import { weekDay } from './week-day';
import { weekDayLocale } from './week-day-locale';

const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|f{1,3}|c{1,2}|C{1,3}|a|A|z{1,3}|Z{1,3}/g;

/** 
 * Returns a string representation of this DateTime formatted according to the specified format string. 
 * @public
 */
export function format(d: DateTime, formatStr: string): string {
    const { calendar, zone, locale, year, month, day, hour, minute, second, ms, ts, } = d;
    let wd = weekDay(d),
        wdl = weekDayLocale(d);

    const zInfo = () => {
        let o = zone.getOffset(ts); // offset
        let p = o > 0; // is positive offset?
        return {
            o,            
            p,
            hr: Math.floor(o / 60) * (p ? 1 : -1),
            min: Math.floor(o % 60) * (p ? 1 : -1),
        };
    };

    const numFormatter = locale.support?.numberFormating ?
        (n: number, pad: number = 1) => locale.formatNumber(n, { minimumIntegerDigits: pad }) :
        (n: number, pad: number = 1) => n.toString();

    const matches: any = {
        Y: () => numFormatter(year),
        YY: () => numFormatter(year, 2),
        YYYY: () => numFormatter(year, 4),
        M: () => numFormatter(month),
        MM: () => numFormatter(month, 2),
        MMM: () => locale.getMonthNames(calendar, 'short')[month - 1],
        MMMM: () => locale.getMonthNames(calendar, 'long')[month - 1],
        d: () => numFormatter(day),
        dd: () => numFormatter(day, 2),
        H: () => numFormatter(hour),
        HH: () => numFormatter(hour, 2),
        h: () => numFormatter(hour % 12),
        hh: () => numFormatter(hour % 12, 2),
        m: () => numFormatter(minute),
        mm: () => numFormatter(minute, 2),
        s: () => numFormatter(second),
        ss: () => numFormatter(second, 2),
        f: () => numFormatter(ms),
        fff: () => numFormatter(ms, 3),
        c: () => numFormatter(wd),
        cc: () => numFormatter(wdl),
        C: () => locale.getWeekdayNames('narrow')[wdl],
        CC: () => locale.getWeekdayNames('short')[wdl],
        CCC: () => locale.getWeekdayNames('long')[wdl],
        z: () => { // Zone offset: +5
            let z = zInfo();
            const o = numFormatter(z.o);
            return z.p ? `+${o}` : o;
        },
        zz: () => { // Zone offset: +05:00
            let z = zInfo();
            return `${z.p ? '+' : '-'}${numFormatter(z.hr, 2)}:${numFormatter(z.min, 2)}`;
        },
        zzz: () => { // Zone offset: +0500
            let z = zInfo();
            return `${z.p ? '+' : '-'}${numFormatter(z.hr, 2)}${numFormatter(z.min, 2)}`;
        },
        Z: () => zone.name, // Zone name, like America/New_York
        ZZ: () => locale.getZoneTitle(zone.name, 'short'), // Short zone title: EST
        ZZZ: () => locale.getZoneTitle(zone.name, 'long'), // Long zone title: Eastern Standard Time          
    };

    return formatStr.replace(REGEX_FORMAT, (match, $1) => {
        let r;
        if ($1) {
            r = $1;
        } else if (matches[match]) {
            r = matches[match]();
        } else {
            r = match;
        }
        return r;
    });
}
