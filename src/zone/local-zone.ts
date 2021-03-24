import { Zone } from './zone';

/** The local zone of this computer (singleton object) */
export class LocalZone extends Zone {

    /**
     * Do not call this constructor. Use LocalZone.instance instead.
     * @private 
     */
    private constructor() {
        const id = Intl?.DateTimeFormat()?.resolvedOptions().timeZone ?? '';
        super();
        if (instance) {
            throw new Error('Invalid Operation');
        }
    }

    /** Gets the local zone */
    static get instance() {
        if (!instance) {
            instance = new LocalZone();
        }
        return instance;
    }

    getOffset(timestamp: number): number {
        return -new Date(timestamp).getTimezoneOffset();
    }

    getName(format: 'long' | 'short' = 'long'): string {
        return format === 'short' ? 'Local' : 'Local Time Zone'; // TODO: return user real local timezone name
    }
}

let instance: LocalZone;
