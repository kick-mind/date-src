import assert from 'assert';
import { DateTimeUnits } from '../../common';
import { PersianCalendar } from './persian';

describe('PersianCalendar', () => {
    const pc = new PersianCalendar();

    it('can compute units from ts', function () {
        assert.strictEqual(pc.getUnits(100000), { year: 2, month: 1, day: 1, hour: 1, minute: 1, second: 1, ms: 1, } as DateTimeUnits);
    });

    it('can compute ts from units', function () {
    });

    it('can add', function () {
    });

    it('can subtract', function () {
    });

    it('can compute leap year', function () {
    });
});


