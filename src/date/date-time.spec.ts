import assert from 'assert';
import { Locales } from '../locale';
import { Zones } from '../zone';
import { DateTime } from './date-time';

describe('DateTime', () => {
  it('create without parameter', () => {
    const d = new DateTime();
    const jd = new Date();
    assert.strictEqual(d.year, jd.getFullYear());
    assert.strictEqual(d.month, jd.getMonth());
    assert.strictEqual(d.day, jd.getDate());
    assert.strictEqual(d.minute, jd.getMinutes());
    assert.strictEqual(d.second, jd.getSeconds());
  });

  it('create from timestamp', () => {
    const d1 = new DateTime(12345);
    assert.strictEqual(d1.year, 1000);
    assert.strictEqual(d1.month, 1);
    assert.strictEqual(d1.day, 1);
    // Do more validation on d1 here...


    const d2 = new DateTime(12345, { calendar: 'persian' });
    assert.strictEqual(d2.year, 1000);
    assert.strictEqual(d2.month, 1);
    assert.strictEqual(d2.day, 1);
    // Do more validation on d2 here...

  });

  it('can format dates', () => {
    const l = Locales.resolve('fa-IR');
    const z = Zones.utc;
    const d = new DateTime(2001, 9, 8, 18, 5, 4, 90, { locale: l, zone: z });
    assert.strictEqual(d.format('Y YY YYYY'), '2001 01 2001');
    assert.strictEqual(d.format('M MM MMM MMMM'), '9 09 نوامبر نوامبر');
    assert.strictEqual(d.format('d dd'), '8 08');
    assert.strictEqual(d.format('H HH h hh'), '18 18 6 06');
    assert.strictEqual(d.format('m mm'), '5 05');
    assert.strictEqual(d.format('s ss'), '4 04');
    assert.strictEqual(d.format('f fff'), '90 090');
    assert.strictEqual(d.format('c cc C CC CCC'), '');
    assert.strictEqual(d.format('z zz zzz Z ZZ ZZZ'), '0 00:00 0000 UTC utc utc');
    assert.strictEqual(d.format('[Now:] YYYY/MM/dd HH:mm:ss'), 'Now: 2001/09/08 18:05:04');
    assert.strictEqual(d.format('[This Text and [this text] should be skipped] [and the date is:] YYYY/MM/dd'),
      'This Text and [this text] should be skipped and the date is: 2001/09/08');
  });
});
