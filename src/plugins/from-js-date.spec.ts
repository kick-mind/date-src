import assert from 'assert';
import { DateTime } from '../main';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('from-js-date', () => {
    it('can create an same object as an DateTime object from javascript Date', () => {
      const dt = new DateTime({
        zone: 'Asia/Tokyo',
        locale: 'ro',
      });
      const d = fromJsDate(new Date(), { zone: 'Asia/Tokyo', locale: 'ro' });
      assert.strictEqual(dt.locale, d.locale);
      assert.strictEqual(dt.zone, d.zone);
      assert.strictEqual(dt.calendar, d.calendar);
    });
  });
});
