import { DateTime } from '../main';
import { weekDay } from './week-day';
import { weekDayLocale } from './week-day-locale';

const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|f{1,3}|c{1,2}|C{1,3}|a|A|z{1,3}|Z{1,3}/g;

/** 
 * Predefined formats 
 * @public
 * @enum
 */
export enum Formats {
    /** ISO 8601 date time format */
    iso = 'YYYY-MM-ddTHH:mm:ss.fffzz'
}

/** 
 * Returns a string representation of this DateTime formatted according to the specified format string. 
 * @param date DateTime
 * @param formatStr Format string
 * @public
 */
export function format(date: DateTime, formatStr: string): string {
    const { calendar, zone, locale, year, month, day, hour, minute, second, ms, ts, } = date;
    let wd = weekDay(date),
        wdl = weekDayLocale(date);

    let zoneOffset = zone.getOffset(ts); // offset
    const zInfo = {
        o: zoneOffset,
        p: zoneOffset >= 0, // is positive offset?,
        s: zoneOffset >= 0 ? '+' : '-', // sign
        hr: Math.abs(Math.floor(zoneOffset / 60)),
        min: Math.abs(Math.floor(zoneOffset % 60)),
    };

    const numFormatter =
        (n: number, pad: number = 1) => locale.formatNumber(n, { minimumIntegerDigits: pad });
        

    const matches: any = {
        Y: () => numFormatter(year),
        YY: () => numFormatter(year, 4).substring(2),
        YYYY: () => numFormatter(year, 4),
        M: () => numFormatter(month),
        MM: () => numFormatter(month, 4).substring(2),
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
            const o = numFormatter(zInfo.o);
            return zInfo.p ? `+${o}` : o;
        },
        zz: () => { // Zone offset: +05:00
            return `${zInfo.s}${numFormatter(zInfo.hr, 2)}:${numFormatter(zInfo.min, 2)}`;
        },
        zzz: () => { // Zone offset: +0500
            return `${zInfo.s}${numFormatter(zInfo.hr, 2)}${numFormatter(zInfo.min, 2)}`;
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
