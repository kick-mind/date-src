import assert from 'assert';
import { weekDay } from './week-day';
import { Calendars, DateTime } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { GregorianCalendar } from '../calendars/gregorian';

describe('Plugins', () => {
  describe('weekDay', () => {
    
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('toJsDate', () => {
      const d = new DateTime({locale: 'fa', calendar: 'persian'}, 1400, 9, 22);
      assert.strictEqual(weekDay(d), 2);
    });
  });
});
