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

     var dt3=  new DateTime({ calendar: 'gregorian' }, 2021, 12, 31);
     console.log(dt3.year + ' ' + dt3.month + ' ' + dt3.day + ' ' + dt3.ms + ' ' + dt3.locale.name);
     console.log(dt2.year + ' ' + dt2.month + ' ' + dt2.day + ' ' + dt2.ms + ' ' + dt2.locale.name); 

     assert.deepStrictEqual({year: dt2.year, month: dt2.month, day: dt2.day}, {
      year: dt3.year,
      month: dt3.month,
      day: dt3.day
    });
  });

  });
});

