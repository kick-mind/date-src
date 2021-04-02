import assert from 'assert';
import { DateTimeUnits } from '../../common';
import { GregorianCalendar } from './gregorian';

describe('GregorianCalendar', () => {
    const gc = new GregorianCalendar();

    it('can compute units from ts', function () {
        assert.strictEqual(gc.getUnits(100000), { year: 2, month: 1, day: 1, hour: 1, minute: 1, second: 1, ms: 1, } as DateTimeUnits);
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

