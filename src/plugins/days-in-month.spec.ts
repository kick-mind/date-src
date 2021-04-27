import assert from 'assert';
import { DateTime } from '../date-time';
import { daysInMonth } from './days-in-month';
import moment from 'moment';

describe('Plugins', () => {
  describe('days-in-month', () => {
    it('can compare with moment for all 12 months in a year', () => {
      const dt = new DateTime();
      dt.locale.getMonthNames(dt.calendar).map((e, i) => {
        let today = new Date();
        let newTimeInMonth = new DateTime(today.getFullYear(), i + 1, 1);
    
        assert.strictEqual(
          moment(
            `${newTimeInMonth.year}-${newTimeInMonth.month}`
          ).daysInMonth(),
          daysInMonth(newTimeInMonth)
        );
      });
    });
  });
});
