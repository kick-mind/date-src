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

    it('can parse time with positive zone', () => {
      const d = parse('05/02/69 1:02:03 PM -05:00', 'MM/DD/YY H:mm:ss A Z');
      assert.deepStrictEqual(
        [d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms , d.zone.getCurrentOffset()],
        [69, 5, 2, 13, 2 , 3, 0 , 300]
      );
    });

    it('can parse time with negative zone', () => {
      const d = parse('05/02/69 1:02:03 PM +05:00', 'MM/DD/YY H:mm:ss A Z');
      assert.deepStrictEqual(
        [d.year, d.month, d.day, d.hour, d.minute, d.second, d.ms , d.zone.getCurrentOffset()],
        [69, 5, 2, 13, 2 , 3, 0 , -300]
      );
    });

    it('can parse strict', () => {
      const d = parse('1970-00-00', 'YYYY-MM-DD');
      assert.deepStrictEqual(
        [d.year, d.month, d.day],
        [1970, 1, 1]
      );
    });

    it('can parse monthname', () => {
      const d = parse('2018 January 15', 'YYYY MMMM DD');
      assert.deepStrictEqual(
        [d.year, d.month, d.day],
        [1970, 1, 1]
      );
    });

  });
});
