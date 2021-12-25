import { weekNumber } from './week-number';
import { Calendars, DateTime } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import assert from 'assert';
import moment from 'moment';

describe('Plugins', () => {
  describe('weekNumber', () => {
    it('weekNumber', () => {
      Calendars.add(new GregorianCalendar('gregorian'));
      const dt1 = new DateTime(2005, 1, 1);

      console.log(weekNumber(dt1));

      const dt = new DateTime(2021, 1, 1, 0, 0, 0, 0, {
        zone: 'Asia/Tehran',
        locale: 'fa',
      });
      assert.strictEqual(weekNumber(dt), moment(dt.ts).week());
    });
  });
});
