import assert from 'assert';
import { isSameOrBefore } from './is-same-or-before';
import moment from 'moment';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-same-or-after', () => {
    it('can compare is-same-or-after with the same function at moment', () => {
      for (let index = 0; index < 10000; index++) {
        const start = new Date(1970, 0, 1);
        const end = new Date();

        const randd1 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        const randd2 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        assert.strictEqual(
          isSameOrBefore(fromJsDate(randd1), fromJsDate(randd2)),
          moment(randd1).isSameOrBefore(moment(randd2))
        );
      }
    });
  });
});
