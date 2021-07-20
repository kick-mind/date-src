import assert from 'assert';
import { DateTime } from '../main';
import { fromObject } from './from-object';

describe('Plugins', () => {
  describe('from-object', () => {
    it('can create an same object as an DateTime object from javascript Date', () => {
      const dt = new DateTime({
        zone: 'Asia/Tokyo',
        locale: 'ro',
      });
      const today = new Date();
      const d = fromObject(
        {
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
          hour: today.getHours(),
          minute: today.getMinutes(),
          second: today.getSeconds(),
        },
        { zone: 'Asia/Tokyo', locale: 'ro' }
      );
      assert.strictEqual(dt.locale, d.locale);
      assert.strictEqual(dt.zone, d.zone);
      assert.strictEqual(dt.calendar, d.calendar);
    });
  });
});
