import { Locale } from '../locale';
import { hasIntl } from '../common';
import { Zone } from './zone';

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
        if (hasIntl()) {
            let f = new Intl.DateTimeFormat(locale instanceof Locale ? locale.id : [], { timeZoneName: format });
            return f.resolvedOptions().timeZone;
        } else {
            return format === 'short' ? 'Local' : 'Local Time Zone';
        }
    }
}

let o: LocalZone;
