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
        let s = o > 0 ? 1 : -1; // sign
        return {
            s,
            o,
            hr: Math.floor(o / 60) * s,
            min: Math.floor(o % 60) * s,
        };
    };

    const matches: any = {
        Y: () => year,
        YY: () => padNum(year, 2),
        YYYY: () => padNum(year, 4),
        M: () => month,
        MM: () => padNum(month, 2),
        MMM: () => locale.getMonthNames(calendar, 'short')[month - 1],
        MMMM: () => locale.getMonthNames(calendar, 'long')[month - 1],
        d: () => day,
        dd: () => padNum(day, 2),
        H: () => hour,
        HH: () => padNum(hour, 2),
        h: () => hour % 12,
        hh: () => padNum(hour % 12, 2),
        m: () => minute,
        mm: () => padNum(minute, 2),
        s: () => second,
        ss: () => padNum(second, 2),
        f: () => ms,
        fff: () => padNum(ms, 3),
        c: () => wd,
        cc: () => wdl,
        C: () => locale.getWeekdayNames('narrow')[wdl],
        CC: () => locale.getWeekdayNames('short')[wdl],
        CCC: () => locale.getWeekdayNames('long')[wdl],
        z: () => { // Zone offset: +5
            let z = zInfo();
            return z.s > 0 ? `+${z.o}` : z.o;
        },
        zz: () => { // Zone offset: +05:00
            let z = zInfo();
            return `${z.s ? '+' : '-'}${padNum(z.hr, 2)}:${padNum(z.min, 2)}`;
        },
        zzz: () => { // Zone offset: +0500
            let z = zInfo();
            return `${z.s ? '+' : '-'}${padNum(z.hr, 2)}${padNum(z.min, 2)}`;
        },
        Z: () => zone.name, // Zone ID: America/New_York
        ZZ: () => locale.getZoneTitle(zone, 'short'), // Short zone title: EST
        ZZZ: () => locale.getZoneTitle(zone, 'long'), // Long zone title: Eastern Standard Time          
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
