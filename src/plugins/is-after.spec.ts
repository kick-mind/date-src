import assert from 'assert';
import { isAfter } from './is-after';
import moment from 'moment';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-after', () => {
    it('can compare is-after with the same function at moment', () => {
      for (let index = 0; index < 10000; index++) {
        const start = new Date(1970, 0, 1);
        const end = new Date();

        const randdt1 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        const randdt2 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        assert.strictEqual(
          isAfter(fromJsDate(randdt1), fromJsDate(randdt2)),
          moment(randdt1).isAfter(moment(randdt2))
        );
      }
    });
  });
});
