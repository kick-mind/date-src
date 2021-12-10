import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { isSame } from '../plugins/is-same';
import { setYear } from '../plugins/set-Year';

describe('Plugins', () => {
  describe('set-year', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('set year', () => {
      const dt = new DateTime(2004, 2, 29, 12, 34, 23, 4);
      const year = 2003;

      const newDate = setYear(dt, year);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(newDate, new DateTime(2003, 2, 28, 12, 34, 23, 4))
      );
    });

    it('set year in persian leap year', () => {
      const dt = new DateTime(1399, 12, 30, 12, 34, 23, 4, {
        calendar: 'persian',
      });
      const year = 1400;

      const newDate = setYear(dt, year);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(newDate, new DateTime(1400, 12, 29, 12, 34, 23, 4))
      );
    });
  });
});
