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
      const d = parse('99/2/6', 'YY/M/D');
      assert.deepStrictEqual(
        [d.year, d.month, d.day,],
        [99, 2, 6]
      );
    });

    it('can parse2', () => {
      const d = parse('2012/2/6', 'Y/M/D');
      assert.deepStrictEqual(
        [d.year, d.month, d.day,],
        [2012, 2, 6]
      );
    });

    it('can parse3', () => {
      const d = parse('12/2/6', 'YY/M/D');
      assert.deepStrictEqual(
        [d.year, d.month, d.day,],
        [2012, 2, 6]
      );
    });

    it('can parse4', () => {
      const d = parse('2012/2/6', 'Y/M/D');
      assert.deepStrictEqual(
        [d.year, d.month, d.day,],
        [2012, 2, 6]
      );
    });
  });
});
