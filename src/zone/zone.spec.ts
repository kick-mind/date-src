/*
 * Before write any tests for zones, read the following article:
 * https://moment.github.io/luxon/docs/manual/zones.html
 */
import { SystemIANAZone } from './system-iana-zone';

describe('Zone', () => {
    it('Should create a SystemIANAZone for zone "Asia/Tehran"', () => {
        const z = new SystemIANAZone('Asia/tehran');
        
        const offset = z.getOffset(Date.UTC(2021, 3, 24));
        expect(offset).toBe(270);

        const longName = z.getName();
        expect(longName).toBe('Iran Daylight Time');
        
        const longName2 = z.getName('long');
        expect(longName2).toBe('Iran Daylight Time');

        const shortName = z.getName('short');
        expect(shortName).toBe('GMT+4:30');
    });
});
