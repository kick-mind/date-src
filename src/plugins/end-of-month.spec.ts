import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { endOfMonth } from '../plugins/end-of-month';
import { isSame } from '../plugins/is-same';
import { PersianCalendar } from '../calendars/persian';
import { HijriCalendar } from '../calendars/hijri';
describe('Plugins', () => {
  describe('end-of-month', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('get end of month', () => {
      const dt = new DateTime(2021, 12, 9, 5, 45, 56, 3, {
        calendar: 'gregorian',
      });
      const dt2 = endOfMonth(dt);

      assert.strictEqual(
        true,
        isSame(dt2, new DateTime({ calendar: 'gregorian' }, 2021, 12, 31))
      );
    });
  });
});
