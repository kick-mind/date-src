import { Locale } from '../locale';
import { hasIntl } from '../common';
import { Zone } from './zone';

let o: LocalZone;
// let cache: {
//     short?: string;
//     long?: string;
// } = {};

/** The local zone of this computer (singleton object) */
export class LocalZone extends Zone {
    /**
     * Do not call this constructor. Use LocalZone.instance instead.
     * @private 
     */
    private constructor() {
        super('Local');
        if (o) {
            throw new Error('Invalid Operation');
        }
    }

    /** Returns the local zone */
    static get instance() {
        if (!o) {
            o = new LocalZone();
        }
        return o;
    }

    getOffset(timestamp: number): number {
        return -new Date(timestamp).getTimezoneOffset();
    }

    getName(format: 'long' | 'short' = 'long', locale?: Locale): string {
        return hasIntl() ?
            new Intl.DateTimeFormat(locale instanceof Locale ? locale.resolvedId : [], { timeZoneName: format })
                .formatToParts(new Date()).find(m => m.type.toLowerCase() === 'timezonename').value :
            (format === 'short' ? 'Local' : 'Local Time Zone');
    }
}
