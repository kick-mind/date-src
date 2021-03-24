import { Zone } from './zone';

/** The local zone of this computer (singleton object) */
export class LocalZone extends Zone {
    /**
     * Do not call this constructor. Use LocalZone.instance instead.
     * @private 
     */
    private constructor() {
        const id = Intl?.DateTimeFormat()?.resolvedOptions().timeZone ?? '';
        super('sdf');
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
}

let instance: LocalZone;
