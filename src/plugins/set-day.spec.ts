import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { isSame } from '../plugins/is-same';
import { setDay } from '../plugins/set-Day';

describe('Plugins', () => {
  describe('set-day', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('set day', () => {
      const dt = new DateTime(2003, 2, 28, 12, 34, 23, 4);
      const day = 2003;

      const newDate = setDay(dt, 29);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2003,
            month: 2,
            day: 28,
            hour: 12,
            minute: 34,
            second: 23,
            ms: 4,
          })
        )
      );
    });
    it('set day2', () => {
      const dt = new DateTime(2003, 2, 28, 12, 34, 23, 4);
      const day = 2003;

      const newDate = setDay(dt, 20);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2003,
            month: 2,
            day: 20,
            hour: 12,
            minute: 34,
            second: 23,
            ms: 4,
          })
        )
      );
    });
  });
});
