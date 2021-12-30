import assert from 'assert';
import { DateTime } from '../main';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('fromJsDate', () => {
    
    it('can create a DateTime object from a javascript Date', () => {
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
