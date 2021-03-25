import { IANAZone } from './iana-zone';

/** An IANA zone created by using Javascript Intl API */
export class JsIANAZone extends IANAZone {
    #long: Intl.DateTimeFormat; // A formatter with long time zone name
    #short: Intl.DateTimeFormat; // A formatter with short time zone name

    constructor(id: string) {
        super(id);

        try {
            this.#long = new Intl.DateTimeFormat([], {
                timeZone: id,
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

    getOffset(timestamp: number): number {
        const date = new Date(timestamp);
        const parts = this.#long.formatToParts(date);
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

    getName(format: 'long' | 'short' = 'long'): string {
        let f;
        if (format == 'short') {
            if (!this.#short) {
                this.#short = new Intl.DateTimeFormat([], { timeZone: this.id, timeZoneName: 'short' });
            }
            f = this.#short;
        } else {
            f = this.#long;
        }

        return f.formatToParts(new Date()).find(m => m.type.toLowerCase() === 'timezonename').value;
    }
}
