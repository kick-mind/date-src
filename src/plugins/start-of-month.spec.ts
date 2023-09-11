import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { startOfMonth } from '../plugins/start-of-month';
import { isSame } from '../plugins/is-same';
import { startOfMonth as fnsStartOfMonth } from 'date-fns';
describe('Plugins', () => {
  describe('start-of-month', () => {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
    });
    it('get start of month', () => {
      const dt = new DateTime(2021, 11, 17, 5, 45, 56, 3);
      const dt2 = startOfMonth(dt);

      assert.strictEqual(
        true,
        isSame(dt2, new DateTime(2021, 11, 1, 0, 0, 0, 0))
      );
    });


    it('fns vs Tick', () => {
      for (let i = 0; i < 1000; i++) {
        let year = Math.floor(Math.random() * 22) + 2001;
        let month = Math.floor(Math.random() * 12);
        let day = Math.floor(Math.random() * 28) + 1;

        const dt = new DateTime(year, month + 1, day);
        const sdt = startOfMonth(dt);
        console.log(sdt.year, sdt.month, sdt.day);
        const dt2 = new Date(year, month, day);
        const sdt2 = fnsStartOfMonth(dt2);
        console.log(sdt2.getFullYear(), sdt2.getMonth() + 1, sdt2.getDate());

        assert.deepStrictEqual({ year: sdt.year, month: sdt.month, day: sdt.day }, { year: sdt2.getFullYear(), month: sdt2.getMonth() + 1, day:sdt2.getDate() });
      }
    });

  });
});
