import { FixedZone } from './fixed-zone';
import { IANAZone } from './iana-zone';
import { LocalZone } from './local-zone';
import { SystemIANAZone } from './system-iana-zone';
import { Zone } from './zone';

const cache: { [key: string]: IANAZone } = {};
const utc = new FixedZone('Coordinated Universal Time', 'UTC', 0);

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

    /** Finds an IANA time zone by id. */
    static find(id: string, opts?: { throwError: boolean }): IANAZone {
        let key = id.toLowerCase();
        let z = cache[key];
        if (z) { return z; }

        try {
            z = new SystemIANAZone(id);
            cache[key] = z;
        } catch {
            if (opts && opts.throwError) { throw new Error('IANA timezone not found.'); }
        }

        return z;
    }
}
