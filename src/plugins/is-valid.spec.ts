import assert from 'assert';
import { isValid } from './is-valid';
import { fromObject } from './from-object';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-valid', () => {
    it('is-valid', () => {
      const start = new Date(1970, 0, 1);
      const end = new Date();

      const randdt = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      assert.strictEqual(
          isValid(
            fromObject(
              {
                year: randdt.getFullYear(),
                month: 15,
                day: randdt.getDate(),
              }
            )
          ),
          false
        );
      assert.strictEqual(isValid(fromJsDate(randdt)), true);
    });
  });
});
