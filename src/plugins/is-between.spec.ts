import assert from 'assert';
import { isBetween } from './is-between';
import moment from 'moment';
import { fromJsDate } from './from-js-date';

describe('Plugins', () => {
  describe('is-between', () => {
    it('can compare is-between with the same function at moment', () => {
      for (let index = 0; index < 10000; index++) {
        const start = new Date(1970, 0, 1);
        const end = new Date();

        const randdt1 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        const randdt2 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        const randdt3 = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        assert.strictEqual(
          isBetween(
            fromJsDate(randdt1),
            fromJsDate(randdt2),
            fromJsDate(randdt3)
          ),
          moment(randdt1).isBetween(moment(randdt2), moment(randdt3))
        );
      }
    });
  });
});
