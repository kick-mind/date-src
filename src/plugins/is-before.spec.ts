import assert from 'assert';
import { isBefore } from './is-before';
import moment from 'moment';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-before', () => {
    it('can compare is-before with the same function at moment', () => {
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
          isBefore(fromJsDate(randdt1), fromJsDate(randdt2)),
          moment(randdt1).isBefore(moment(randdt2))
        );
      }
    });
  });
});
