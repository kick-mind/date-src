import { FixedZone } from './fixed-zone';
import { IANAZone } from './iana-zone';
import { LocalZone } from './local-zone';
import { RuntimeIANAZone } from './runtime-iana-zone';
import { Zone } from './zone';

const cache: { [key: string]: IANAZone } = {};
const utc = new FixedZone('UTC', 'Coordinated Universal Time', 'UTC', 0);
const local = LocalZone.instance;

/** A class with some static methods for managing zones. */
export abstract class Zones {
    /** Gets the zone of this computer. */
    static get local(): Zone {
        return local;
    }

    /** Returns UTC zone. */
    static get utc(): Zone {
        return utc;
    }

    /** Finds an IANA time zone by id. */
    static find(id: string, opts?: { throwError: boolean }): Zone {
        let key = id.toLowerCase();
        let z = cache[key];
        if (z) { return z; }

        try {
            z = cache[key] = new RuntimeIANAZone(id);
        } catch {
            if (opts && opts.throwError) { throw new Error('Zone not found.'); }
        }

        return z;
    }
}
