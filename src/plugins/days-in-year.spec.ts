import assert from 'assert';
import { DateTime } from '../date-time';
import { daysInYear } from './days-in-year';
import moment from 'moment';

describe('Plugins', () => {
  describe('days-in-year', () => {
    it('can compare with moment for some random years start from 1970 to 3941', () => {
      const dt = new DateTime();
      const lyear = Math.floor(Math.random() * 1970) + 1971;

      for (let index = 1970; index <= lyear; index++) {
        let rdate = new DateTime(index, 1, 1);
        let days = 0;
        dt.locale.getMonthNames(dt.calendar).map((e, i) => {
          let newTimeInMonth = new DateTime(rdate.year, i + 1, 1);
          days += moment(
            `${newTimeInMonth.year}-${newTimeInMonth.month}`
          ).daysInMonth();
        });
        let d = daysInYear(rdate);
        assert.strictEqual(days, d);
      }
    });
  });
});
