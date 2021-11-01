import { Zone } from '.';
import { hasIntl, IsInt } from '../../common';
import { FixedZone } from './fixed-zone';
import { IANAZone } from './iana-zone';
import { LocalZone } from './local-zone';
import { RuntimeIANAZone } from './runtime-iana-zone';

const zones = {
    utc: new FixedZone('UTC', 0),
    local: new LocalZone(),
    iana: {} as { [name: string]: IANAZone }
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
    static get local(): LocalZone {
        return zones.local;
    }

    /** Gets UTC time zone. */
    static get utc(): FixedZone {
        return zones.utc;
    }

    /** Creates a fixed time zone. */
    static fixed(name: string, hour: number, minute = 0, second = 0): FixedZone {
        return new FixedZone(name, second * 1000 + minute * 60 * 1000 + hour * 60 * 60 * 1000);
    }

    /**
     * Tries to resolve an IANA time zone.  
     * It first tries to find the zone in the repository. If find operation fails, it tries to create a RuntimeIANAZone (a Zone created by using javascript Intl API).
     * If creating RuntimeIANAZone fails, this method returns undefined or throws an error (based on "opts.strict" parameter)
     * @public
     * @static
     */
    static iana(ianaName: string, opts?: { strict: boolean }): IANAZone {
        let key = ianaName.toLowerCase();
        let z: Zone = zones.iana[key];

        if (!z) {
            try {
                z = zones.iana[key] = new RuntimeIANAZone(ianaName);
            } catch (e) {
                if (opts?.strict) {
                    throw Error('Could not resolve zone');
                }
            }
        }

        return z;
    }
}
