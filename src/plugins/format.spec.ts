import assert from 'assert';
import { Calendars, DateTime, Locales, Zones } from '../main';
import { format } from './format';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { PersianCalendar } from '../calendars/persian';

describe('Plugins', () => {
  describe('format', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('can format dates (fa-IR)', () => {
      const l = Locales.resolve({ name: 'fa-IR', weekStart: 6 });
      const z = Zones.utc;
      const d = new DateTime(2001, 9, 8, 18, 5, 4, 90, { locale: l, zone: z });

      assert.strictEqual(format(d, 'Y YY YYYY'), '۲۰۰۱ ۰۱ ۲۰۰۱');
      // assert.strictEqual(format(d, 'M MM MMM MMMM', { shortMonthNameMaxLength: 3 }), '۹ ۰۹ سپت سپتامبر');
      assert.strictEqual(format(d, 'd dd'), '۸ ۰۸');
      assert.strictEqual(format(d, 'H HH h hh'), '۱۸ ۱۸ ۶ ۰۶');
      assert.strictEqual(format(d, 'm mm'), '۵ ۰۵');
      assert.strictEqual(format(d, 's ss'), '۴ ۰۴');
      assert.strictEqual(format(d, 'f fff'), '۹۰ ۰۹۰');
      //assert.strictEqual(format(d, 'c cc C CC CCC'), '۶ ۵ پ پنجشنبه پنجشنبه');
      assert.strictEqual(
        format(d, 'z zz zzz Z ZZ ZZZ'),
        '+۰ +۰۰:۰۰ +۰۰۰۰ UTC UTC زمان هماهنگ جهانی'
      );
    });

    it('can format dates (en-US) 1', () => {
      const l = Locales.resolve({ name: 'en', weekStart: 0 });
      const z = Zones.local;
      const d = new DateTime(
        { locale: l, zone: z, calendar: Calendars.find('gregorian') },
        2022,
        6,
        26
      );
      console.log(format(d, 'CC') + ' ' + d.locale.weekStart);
      assert.strictEqual(format(d, 'CC'), 'Sun');
    });

    it('can format dates (en-US) 2', () => {
      const l = Locales.resolve({ name: 'en', weekStart: 0 });
      const z = Zones.utc;
      const d = new DateTime(
        { locale: l, zone: z, calendar: Calendars.find('gregorian') },
        2022,
        6,
        26
      );
      console.log(format(d, 'CC') + ' ' + d.locale.weekStart);
      assert.strictEqual(format(d, 'CC'), 'Sun');
    });
  });
});
