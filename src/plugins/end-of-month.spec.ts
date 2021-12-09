import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { endOfMonth } from '../plugins/end-of-month';
import { isSame } from '../plugins/is-same';
describe('Plugins', () => {
  describe('end-of-month', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
    });
    it('get end of month', () => {
      const dt = new DateTime(2021, 12, 9, 5, 45, 56, 3);
      const dt2 = endOfMonth(dt);

      assert.strictEqual(
        true,
        isSame(dt2, new DateTime(2021, 12, 31))
      );
    });
  });
});
