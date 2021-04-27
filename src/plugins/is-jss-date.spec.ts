import assert from 'assert';
import { isJssDate } from './is-jss-date';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-between', () => {
    it('can compare is-between with the same function at moment', () => {
      for (let index = 0; index < 10000; index++) {
        const start = new Date(1970, 0, 1);
        const end = new Date();

        const randdt = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        assert.strictEqual(isJssDate(fromJsDate(randdt)), true);
      }
    });
  });
});
