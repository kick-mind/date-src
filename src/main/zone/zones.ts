import { hasIntl } from '../../common';
import { FixedZone } from './fixed-zone';
import { LocalZone } from './local-zone';
import { RuntimeIANAZone } from './runtime-iana-zone';
import { Zone } from './zone';

const cache: { [key: string]: Zone } = {
    utc: new FixedZone('UTC', 0),
    local: new LocalZone()
};

/** A class with some static methods for managing zones. */
export abstract class Zones {
    /** Gets the system's local zone. */
    static get local(): Zone {
        return cache.local;
    }

    /** Gets UTC zone. */
    static get utc(): Zone {
        return cache.utc;
    }

    /** Tries to resolve a Zone by it's name. */
    static resolve(name: string, opts?: { throwError: boolean }): Zone {
        let key = name.toLowerCase();
        let z = cache[key];
        if (!z) {
            if (hasIntl()) {
                try {
                    z = cache[key] = new RuntimeIANAZone(name);
                } catch (e) {
                    if (opts && opts.throwError) { throw e; }
                }
            } else {
                throw Error('Could not resolve zone');
            }
        }

        return z;
    }
}
