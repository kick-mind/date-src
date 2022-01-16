import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { daysInMonth } from './days-in-month';
import moment from 'moment';

describe('Plugins', () => {
  describe('days-in-month', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('can compare with moment for all 12 months in a year', () => {
      const dt = new DateTime({ calendar: 'gregorian' });
      dt.locale.getMonthNames(dt.calendar).map((e, i) => {
        let today = new Date();
        let newTimeInMonth = new DateTime(
          { calendar: 'gregorian' },
          today.getFullYear(),
          i + 1,
          1
        );

        assert.strictEqual(
          moment(
            `${newTimeInMonth.year}-${newTimeInMonth.month}`
          ).daysInMonth(),
          daysInMonth(newTimeInMonth)
        );
      });
    });
  });
});
