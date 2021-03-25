/*
 * Before write any tests for zones, read the following article:
 * https://moment.github.io/luxon/docs/manual/zones.html
 */
import { LocalZone } from './local-zone';

describe('Local Zone', () => {
    it('Should display local name correctly', () => {
        const z = LocalZone.instance;
        
        const longName = z.getName();
        expect(longName).toBe('Asia/Tehran');
        
        const shortName = z.getName('short');
        expect(shortName).toBeDefined('Asia/Tehran');
    });

});
