import assert from 'assert';
import { DateTimeUnits } from '../common';
import { PersianCalendar } from './persian/persian';

describe('Calendar', () => {
    describe('Persian', () => {
        it('can compute DateTime units from ts', function () {
            const pc = new PersianCalendar();
            assert.strictEqual(pc.getUnits(100000), { year: 2, month: 1, day: 1, hour: 1, second: 1, ms: 1, minute: 1 } as DateTimeUnits);

        });
    });

    describe('Hijri', () => {

    });

    describe('Gregorian', () => {

    });

    describe('Gregorian2', () => {

    });
});

