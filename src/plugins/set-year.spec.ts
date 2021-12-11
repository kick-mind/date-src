import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { isSame } from '../plugins/is-same';
import { setYear } from '../plugins/set-Year';
import { setMonth } from './set-month';

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

    it('set year in persian leap year', () => {
      const dt = new DateTime(1399, 12, 30, 12, 34, 23, 4, {
        calendar: 'persian',
      });
      const year = 1400;

      const newDate = setYear(dt, year);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 1400,
            month: 12,
            day: 29,
            hour: 12,
            minute: 34,
            second: 23,
            ms: 4,
          })
        )
      );
    });

    it('set year in persian leap year and month', () => {
      const dt = new DateTime(1399, 1, 31, 12, 34, 23, 4, {
        calendar: 'persian',
      });
      const year = 1398;
      const month = 12;

      const newDate = setYear(dt, year);
      const newDate2 = setMonth(newDate, month);

      console.log(
        newDate2.year +
          ' ' +
          newDate2.month +
          ' ' +
          newDate2.day +
          ' ' +
          newDate2.hour +
          ' ' +
          newDate2.minute +
          ' ' +
          newDate2.second,
        +' ' + newDate2.ms
      );
      assert.strictEqual(
        true,
        isSame(
          newDate2,
          dt.clone({
            year: 1398,
            month: 12,
            day: 29,
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
