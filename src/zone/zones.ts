import { Zone } from './zone';

const cache = new Array<Zone>();

export abstract class Zones {
    /** Gets the zone of this computer. */
    static get local(): Zone {
        throw new Error('Method not implemented.');
    }

    /** Gets the zone of this computer. */
    static get utc(): Zone {
        throw new Error('Method not implemented.');
    }

    /** Finds a Zone by name. */
    static get(name: string): Zone {
        return cache.find(x => x.id === name);
    }
}
