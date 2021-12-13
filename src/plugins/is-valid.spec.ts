import assert from 'assert';
import { isValid } from './is-valid';
import { fromJsDate } from './from-js-date';
import { Calendars, DateTime } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { PersianCalendar } from '../calendars/persian';

describe('Plugins', () => {
  describe('is-valid', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });


    it('can check validity of a DateTime', () => {
      const invalidDates = [
        new DateTime({ calendar: 'persian' }, -1400, 1, 1), // invalid year
        new DateTime({ calendar: 'persian' }, 1400, -1, 31), // invalid month
        new DateTime({ calendar: 'persian' }, 1400, 13, 31), // invalid month
        new DateTime({ calendar: 'persian' }, 1400, 9, 31), // invalid day
        new DateTime({ calendar: 'persian' }, 1400, 9, -1), // invalid day
        new DateTime({ calendar: 'persian' }, 1400, 9, 30, 25) // invalid hour
      ];
      invalidDates.forEach(d => assert.strictEqual(isValid(d), false));


    });
  });
});
