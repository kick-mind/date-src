import assert from 'assert';
import { DateTime } from '../main';
import { parse } from './parse';

describe('Plugins', () => {
  describe('Parse', () => {
    it('can parse', () => {
      const d = parse('1399/2/2', 'Y/M/M');
      // assert.ok(d.isSame(new DateTime(1399, 2, 2)));
    });
  });
});
