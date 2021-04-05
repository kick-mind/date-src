import { Locale } from '../locale';

/** An abstract base class for all zones */
export abstract class Zone {
    #id: string;

    constructor(id: string) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    /** Gets the offset of the zone (in minutes) */
    abstract getOffset(timestamp: number): number;
}
