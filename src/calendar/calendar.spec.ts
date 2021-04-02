import assert from 'assert';
import { DateTimeUnits } from '../common';
import { PersianCalendar } from './persian/persian';

describe('Calendar', () => {
    const pc = new PersianCalendar();

    it('can compute units from ts', function () {
        assert.strictEqual(pc.getUnits(100000), { year: 2, month: 1, day: 1, hour: 1, minute: 1, second: 1, ms: 1, } as DateTimeUnits);
    });

});

