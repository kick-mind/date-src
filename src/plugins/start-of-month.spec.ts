import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { startOfMonth } from '../plugins/start-of-month';
import { isSame } from '../plugins/is-same';
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
  });
});
