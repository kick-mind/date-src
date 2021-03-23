import { LocalZone } from './local-zone';
import { Zone } from './zone';

const cache = new Array<Zone>();

/** A class with some static methods for managing zones. */
export abstract class Zones {
    /** Gets the zone of this computer. */
    static get local(): Zone {
        return LocalZone.instance;
    }

    /** Gets the zone of this computer. */
    static get utc(): Zone {
        throw new Error('Method not implemented.');
    }

    /** Finds a zone by name. */
    static find(name: string): Zone {
        return cache.find(x => x.id === name);
    }
}
