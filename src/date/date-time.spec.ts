import assert from 'assert';
import { Locales } from '../locale';
import { Zones } from '../zone';
import { DateTime } from './date-time';

function assertDateEquality(date: Date, dateTime: DateTime) {
  assert.deepStrictEqual(
    [dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second, dateTime.ms],
    [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()]
  );
}

function assertUtcDateEquality(date: Date, dateTime: DateTime) {
  assert.deepStrictEqual(
    [dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second, dateTime.ms],
    [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()]
  );
}


describe('DateTime', () => {
  it('create without parameter (local time zone, system locale, default calendar)', () => {
    const d = new Date();
    const dt = new DateTime();
    assertDateEquality(d, dt);
  });

  it('create with UTC zone (system locale, default calendar)', () => {
    const d = new Date();
    const dt = new DateTime({ zone: Zones.utc });
    assertUtcDateEquality(d, dt);
  });

  it('create from timestamp (local time zone, system locale, default calendar)', () => {
    const d = new Date();
    const dt = new DateTime(d.valueOf());
    assertDateEquality(d, dt);
  });

  it('can format dates', () => {
    const l = Locales.resolve('fa-IR', { weekStart: 6 });
    const z = Zones.utc;
    const d = new DateTime(2001, 9, 8, 18, 5, 4, 90, { locale: l, zone: z });
    assert.strictEqual(d.format('Y YY YYYY'), '2001 01 2001');
    assert.strictEqual(d.format('M MM MMM MMMM'), '9 09 سپتامبر سپتامبر');
    assert.strictEqual(d.format('d dd'), '8 08');
    assert.strictEqual(d.format('H HH h hh'), '18 18 6 06');
    assert.strictEqual(d.format('m mm'), '5 05');
    assert.strictEqual(d.format('s ss'), '4 04');
    assert.strictEqual(d.format('f fff'), '90 090');
    assert.strictEqual(d.format('c cc C CC CCC'), '6 6 پ پنجشنبه پنجشنبه');
    assert.strictEqual(d.format('z zz zzz Z ZZ ZZZ'), '0 +00:00 +0000 UTC UTC زمان هماهنگ جهانی');
    assert.strictEqual(d.format('[Now:] YYYY/MM/dd HH:mm:ss'), 'Now: 2001/09/08 18:05:04');
    assert.strictEqual(d.format('[This Text should be skipped] [and the date is:] YYYY/MM/dd'),
      'This Text should be skipped and the date is: 2001/09/08');
  });
});
