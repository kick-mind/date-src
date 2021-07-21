import assert from 'assert';
import { Calendars, DateTime } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { parse } from './parse';

describe('Plugins', () => {
  describe('Parse', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('can parse', () => {
      const d = parse('2012/2/6', 'YY/M/D');
      assert.deepStrictEqual(
        [d.year, d.month, d.day,],
        [2012, 2, 6]
      );
    });
  });
});
