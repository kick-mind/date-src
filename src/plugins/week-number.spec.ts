import { weekNumber } from './week-number';
import { DateTime } from '../date-time';
import assert from 'assert';
import moment from 'moment';

describe('Plugins', () => {
  describe('weekNumber', () => {
    it('weekNumber', () => {
      const dt = new DateTime(2021, 1, 1, 0, 0, 0, 0, {
        zone: 'Asia/Tehran',
        locale: 'fa',
      });
      assert.strictEqual(weekNumber(dt), moment(dt.ts).week());
    });
  });
});
