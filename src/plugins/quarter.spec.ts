import assert from 'assert';
import { quarter } from './quarter';
import moment from 'moment';
import { fromJsDate } from './from-js-date';
import { DateTime } from '../main';
import { Calendar, Calendars } from '../main';

describe('Plugins', () => {
  describe('quarter', () => {
    it('quarter', () => {
      for (let index = 0; index < 100; index++) {
        const start = new DateTime(1970, 0, 1);
        const end = new DateTime();

        const randdt = new DateTime(
          start.ms + Math.random() * (end.ms - start.ms)
        );
        let r = new Date(2013, 4, 1);
        let rr = fromJsDate(r).subtract({ ms: 1 });
        let t1 = quarter(rr);
        let t2 = moment(r).quarter();
        assert.strictEqual(
          quarter(randdt),
          moment({
            year: randdt.year,
            month: randdt.month,
            day: randdt.day,
          }).quarter()
        );
      }
    });

    it('can compair two same datetime but with different calndar, if their quarter has different result based on their calendar.', function () {
      const dt = new DateTime(1400, 2, 10, 0, 0, 0, 0, {calendar: 'persian'});
      const q  = quarter(dt);
      const dt2 =  new DateTime(2021, 4, 30, 0, 0, 0, 0, {calendar: 'gregorian'});
      const q2 = quarter(dt2);
      assert.strictEqual(q , 1);
      assert.strictEqual(q2 , 2);
    });
  });
});
