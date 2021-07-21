import assert from 'assert';
import { DateTime } from '../main';
import { parse } from './parse';

describe('Plugins', () => {
  describe('Parse', () => {
    it('can parse', () => {
      const d = parse('1399/2/6', 'Y/M/D');
      assert.ok(d.year == 1399 && d.month == 2 && d.day == 6);
    });
  });
});
