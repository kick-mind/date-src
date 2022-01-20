/**
 * @category Zone
 * @module RuntimeIANAZone
 */


import { IANAZone } from './iana-zone';

/** 
 * An IANA zone created by using Javascript Intl API 
 * @public
 */
export class RuntimeIANAZone extends IANAZone {
    #f: Intl.DateTimeFormat;

    constructor(zoneName: string) {
        super(zoneName);
        try {
            this.#f = new Intl.DateTimeFormat(['en'], {
                timeZone: zoneName,
                hour12: false,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'long',
            });
        } catch (e) {
            throw new Error('IANA zone name is invalid or not supported');
        }
    }

    getOffset(timestamp: number): number {
        const parts = this.#f.formatToParts(new Date(timestamp));
        const units = ['year', 'month', 'day', 'hour', 'minute', 'second'].map(key => parseInt(parts.find(x => x.type === key).value, 10));

        // Workaround for the same behavior in different node version
        // https://github.com/nodejs/node/issues/33027
        /* istanbul ignore next */
        const fixedHour = units[3] === 24 ? 0 : units[3];
        const utcTimestamp = Date.UTC(units[0], units[1] - 1, units[2], fixedHour, units[4], units[5], 0);
        const timestampMilliseconds = timestamp % 1000;
        timestamp -= timestampMilliseconds; // We should ignore timestamp's milliseconds beacuse [utcTimestamp] is created without milliseconds.
        const diff = utcTimestamp - timestamp;
        return diff / (60 * 1000);
    }
}
