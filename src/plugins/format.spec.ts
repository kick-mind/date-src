import assert from 'assert';
import { DateTime, Locales, Zones } from '../main';
import { format } from './format';

describe('Plugins', () => {
  describe('format', () => {
    it('can format dates', () => {
      const l = Locales.resolve('fa-IR', { weekStart: 6 });
      const z = Zones.utc;
      const d = new DateTime(2001, 9, 8, 18, 5, 4, 90, { locale: l, zone: z });
      let r = format(d, 'c cc C CC CCC');
      assert.strictEqual(format(d, 'Y YY YYYY'), '2001 01 2001');
      assert.strictEqual(format(d, 'M MM MMM MMMM'), '9 09 سپتامبر سپتامبر');
      assert.strictEqual(format(d, 'd dd'), '8 08');
      assert.strictEqual(format(d, 'H HH h hh'), '18 18 6 06');
      assert.strictEqual(format(d, 'm mm'), '5 05');
      assert.strictEqual(format(d, 's ss'), '4 04');
      assert.strictEqual(format(d, 'f fff'), '90 090');
      assert.strictEqual(format(d, 'c cc C CC CCC'), '6 5 پ پنجشنبه پنجشنبه');
      assert.strictEqual(
        format(d, 'z zz zzz Z ZZ ZZZ'),
        '0 +00:00 +0000 UTC UTC زمان هماهنگ جهانی'
      );
    });
  });
});
