import { IANAZone } from './iana-zone';

/** formatters cache */
let cache: { [zoneId: string]: Intl.DateTimeFormat } = {};

/** 
 * An IANA zone created by using Javascript Intl API 
 * @public
 */
export class RuntimeIANAZone extends IANAZone {
    constructor(name: string) {
        super(name);
        let key = name.toLowerCase();

        if (!cache[key]) {
            try {
                cache[key] = new Intl.DateTimeFormat([], {
                    timeZone: name,
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
                throw new Error('Invalid zone id');
            }
        }
    }

    getOffset(timestamp: number): number {
        const parts = cache[this.name.toLowerCase()].formatToParts(new Date(timestamp));
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
