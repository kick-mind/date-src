import assert from 'assert';
import { toArray } from './to-array';
import { DateTime } from '../date-time';

describe('Plugins', () => {
  describe('toArray', () => {
    it('toArray', () => {
      const now = new DateTime();
      const dt = toArray(new DateTime());

      assert.strictEqual(Array.isArray(dt), true);
      assert.strictEqual(dt[0], now.year);
      assert.strictEqual(dt[1], now.month);
      assert.strictEqual(dt[2], now.day);
      assert.strictEqual(dt[3], now.hour);
      assert.strictEqual(dt[4], now.minute);
      assert.strictEqual(dt[5], now.second);
    });
  });
});
