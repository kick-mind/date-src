import { weekNumber } from './week-number';
import { DateTime } from '../date-time';
import assert from 'assert';

describe('Plugins', () => {
  describe('weekNumber', () => {
    it('weekNumber', () => {
      const dt = new DateTime(1399, 1, 1, 0, 0, 0, 0, {
        calendar: 'persian',
        zone: 'Iran/Tehran'
      });
      let y = weekNumber(dt);
      // assert.strictEqual(weekNumber(dt), 6);
    });
  });
});
