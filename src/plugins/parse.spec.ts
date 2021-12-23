import assert from 'assert';
import { Calendars, DateTime, Locales } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { HijriCalendar } from '../calendars/hijri';
import { parse } from './parse';

describe('Plugins', () => {
  describe('Parse', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new HijriCalendar('hijri', 0));
    });

    it('can parse', () => {
      const d = parse('99/2/6', 'YY/M/d');
      assert.deepStrictEqual([d.year, d.month, d.day], [99, 2, 6]);
    });

    it('can parse2', () => {
      const d = parse('2012/2/6', 'Y/M/d');
      assert.deepStrictEqual([d.year, d.month, d.day], [2012, 2, 6]);
    });

    it('can parse3', () => {
      const d = parse('2012/2/6', 'Y/M/d');
      assert.deepStrictEqual([d.year, d.month, d.day], [2012, 2, 6]);
    });

    it('can parse4', () => {
      const d = parse('2012/2/6', 'Y/M/d');
      assert.deepStrictEqual([d.year, d.month, d.day], [2012, 2, 6]);
    });

    it('can parse non-alphanumeric characters', () => {
      const d = parse('10/15/2020', 'MM-dd-YYYY');
      assert.deepStrictEqual([d.year, d.month, d.day], [2020, 10, 15]);
    });

    it('can parse time with positive zone', () => {
      const d = parse('05/02/69 1:02:03 PM -05:00', 'MM/dd/YY H:mm:ss A Z');
      assert.deepStrictEqual(
        [
          d.year,
          d.month,
          d.day,
          d.hour,
          d.minute,
          d.second,
          d.ms,
          d.zone.getCurrentOffset(),
        ],
        [69, 5, 2, 13, 2, 3, 0, 300]
      );
    });

    it('can parse time with negative zone', () => {
      const d = parse('05/02/69 1:02:03 PM +05:00', 'MM/dd/YY H:mm:ss A Z');
      assert.deepStrictEqual(
        [
          d.year,
          d.month,
          d.day,
          d.hour,
          d.minute,
          d.second,
          d.ms,
          d.zone.getCurrentOffset(),
        ],
        [69, 5, 2, 13, 2, 3, 0, -300]
      );
    });

    it('can parse strict', () => {
      const d = parse('1970-00-00', 'YYYY-MM-dd');
      assert.deepStrictEqual([d.year, d.month, d.day], [1970, 1, 1]);
    });

    it('sample_1', () => {
      const d = parse('12-25-1995', 'MM-dd-YYYY');
      assert.deepStrictEqual([d.year, d.month, d.day], [1995, 12, 25]);
    });

    it('sample_2', () => {
      const d = parse('12/25/1995', 'MM-dd-YYYY');
      assert.deepStrictEqual([d.year, d.month, d.day], [1995, 12, 25]);
    });

    it('sample_3', () => {
      const d = parse('24/12/2019 09:15:00', 'dd MM YYYY hh:mm:ss');
      assert.deepStrictEqual(
        [d.year, d.month, d.day, d.hour, d.minute, d.second],
        [2019, 12, 24, 9, 15, 0]
      );
    });

    it('sample_4', () => {
      const d = parse('2010-10-20 4:30', 'YYYY-MM-dd HH:mm');
      assert.deepStrictEqual(
        [d.year, d.month, d.day, d.hour, d.minute, d.second],
        [2010, 10, 20, 4, 30, 0]
      );
    });

    it('sample_5', () => {
      const d = parse('2010-10-20 4:30 +0000', 'YYYY-MM-dd HH:mm Z');
      assert.deepStrictEqual(
        [
          d.year,
          d.month,
          d.day,
          d.hour,
          d.minute,
          d.second,
          d.zone.getCurrentOffset(),
        ],
        [2010, 10, 20, 4, 30, 0, 0]
      );
    });

    it('parse persian numbers', () => {
      const d = parse('۲۰۱۰-۱۰-۲۰ ۴:۳۰', 'YYYY-MM-dd HH:mm', {
        calendar: 'persian',
        locale: Locales.resolve('fa-IR'),
      });
      assert.deepStrictEqual(
        [d.year, d.month, d.day, d.hour, d.minute, d.second],
        [2010, 10, 20, 4, 30, 0]
      );
    });

    it('parse arabic numbers', () => {
      const d = parse('٢٠١٠-١٠-٢٠ ٤:٣٠', 'YYYY-MM-dd',{
        calendar: 'hijri',
        locale: Locales.resolve('ar-AE'),
      });

      assert.deepStrictEqual([d.year, d.month, d.day], [2010, 10, 20]);
    });

    // it('can parse monthname', () => {
    //   const d = parse('2018 January 15', 'YYYY MMMM DD');
    //   assert.deepStrictEqual(
    //     [d.year, d.month, d.day],
    //     [1970, 1, 1]
    //   );
    // });
  });
});
