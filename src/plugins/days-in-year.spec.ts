import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { daysInYear } from './days-in-year';
import moment from 'moment';

describe('Plugins', () => {
  describe('days-in-year', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });
    it('can compare with moment for some random years start from 1970 to 3941', () => {
      const dt = new DateTime({ calendar: 'gregorian' });
      const lyear = Math.floor(Math.random() * 1970) + 1971;

      for (let index = 1970; index <= lyear; index++) {
        let rdate = new DateTime({ calendar: 'gregorian' }, index, 1, 1);
        let days = 0;
        dt.locale.getMonthNames(dt.calendar).map((e, i) => {
          let newTimeInMonth = new DateTime(
            { calendar: 'gregorian' },
            rdate.year,
            i + 1,
            1
          );
          days += moment(
            `${newTimeInMonth.year}-${newTimeInMonth.month}`
          ).daysInMonth();
        });
        let d = daysInYear(rdate);
        assert.strictEqual(days, d);
      }
    });
  });
});
