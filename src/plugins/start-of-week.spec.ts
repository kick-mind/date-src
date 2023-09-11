import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { GregorianCalendar } from '../calendars/gregorian';
import { startOfWeek } from '../plugins/start-of-week';
import { isSame } from '../plugins/is-same';
import { startOfWeek as fnsStartOfWeek } from 'date-fns';

describe('Plugins', () => {
  describe('start-of-week', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('get start of week', () => {
      const dt = new DateTime(1400, 9, 18, 5, 45, 56, 3);
      const dt2 = startOfWeek(dt, 6);

      assert.strictEqual(
        true,
        isSame(dt2, new DateTime(1400, 9, 13, 0, 0, 0, 0))
      );
    });

    it('get start of week in gregorian', () => {
      const dt = new DateTime(2021, 10, 2, 5, 45, 56, 3, {
        calendar: 'gregorian',
      });
      const dt2 = startOfWeek(dt, 0);

      assert.strictEqual(
        true,
        isSame(dt2, new DateTime(2021, 9, 26, 0, 0, 0, 0))
      );
    });

    // it('fns vs Tick', () => {
    //   for (let i = 1; i < 2; i++) {
    //     let year = Math.floor(Math.random() * 22) + 2001;
    //     let month = Math.floor(Math.random() * 12);
    //     let day = Math.floor(Math.random() * 28) + 1;
    //     const dt = new DateTime(year, month + 1, day);
    //     const sdt = startOfWeek(dt, 0);
    //     console.log(sdt.year, sdt.month, sdt.day);
    //     const dt2 = new Date(year, month, day);
    //     const sdt2 = fnsStartOfWeek(dt2, { weekStartsOn: 0 });
    //     console.log(sdt2.getFullYear(), sdt2.getMonth() + 1, sdt2.getDate());        
    //     assert.deepStrictEqual({ year: sdt.year, month: sdt.month, day: sdt.day }, { year: sdt2.getFullYear(), month: sdt2.getMonth() + 1, day:sdt2.getDate() });
    //   }
    // });
  });
});
