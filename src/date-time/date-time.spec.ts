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

  it('can be created from years, month, day, ...', () => {
    const d = new Date();
    const dt = new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    assertDateEquality(d, dt);
  });
  
});
