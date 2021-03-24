import { FixedZone } from './fixed-zone';
import { LocalZone } from './local-zone';
import { SystemIANAZone } from './system-iana-zone';
import { Zone } from './zone';

const cache: { [key: string]: Zone } = {};
const utc = new FixedZone('UTC', 0);

/** A class with some static methods for managing zones. */
export abstract class Zones {
    /** Gets the zone of this computer. */
    static get local(): Zone {
        return LocalZone.instance;
    }

    /** Gets the zone of this computer. */
    static get utc(): Zone {
        return utc;
    }

    /** Finds an IANA zone by id. */
    static find(id: string, opts?: { throwError: boolean }): Zone {
        let z = cache[id];
        if (z) { return cache[id]; }

        try {
            z = new SystemIANAZone(id);
            cache[id] = z;
        } catch (e) {
            if (opts && opts.throwError) { throw e; }
        }

        return z;
    }
}
