import { hasIntl } from '../../common';
import { FixedZone } from './fixed-zone';
import { IANAZone } from './iana-zone';
import { LocalZone } from './local-zone';
import { RuntimeIANAZone } from './runtime-iana-zone';
import { Zone } from './zone';

const cache: { [key: string]: Zone } = {
    utc: new FixedZone('UTC', 0),
    local: new LocalZone()
};

/** 
 * A class for managing time zones.
 * @public
 * @abstract
 */
export abstract class Zones {
    /** 
     * Gets the system's local time zone. 
     */
    static get local(): Zone {
        return cache.local;
    }

    /** Gets UTC time zone. */
    static get utc(): Zone {
        return cache.utc;
    }

    /** Creates an IANAZone by it's IANA name. */
    static iana(ianaName: string, opts?: { throwError: boolean }): IANAZone {
        let key = ianaName.toLowerCase();
        let z = cache[key];
        if (!z) {
            if (hasIntl()) {
                try {
                    z = cache[key] = new RuntimeIANAZone(ianaName);
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
