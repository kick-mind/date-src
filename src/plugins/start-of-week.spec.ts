import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { GregorianCalendar } from '../calendars/gregorian';
import { startOfWeek } from '../plugins/start-of-week';
import { isSame } from '../plugins/is-same';
describe('Plugins', () => {
  describe('start-of-week', () => {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new GregorianCalendar('gregorian'));
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
  });
});
