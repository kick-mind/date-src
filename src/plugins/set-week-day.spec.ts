import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { GregorianCalendar } from '../calendars/gregorian';
import { isSame } from '../plugins/is-same';
import { setWeekDay } from '../plugins/set-week-day';

// Set week day to Sunday, with the default weekStartsOn of Sunday:
//var result = setDay(new Date(2014, 8, 1), 0)
//=> Sun Aug 31 2014 00:00:00

// @example
// Set week day to Sunday, with a weekStartsOn of Monday:
// var result = setDay(new Date(2014, 8, 1), 0, { weekStartsOn: 1 })
//=> Sun Sep 07 2014 00:00:00

describe('Plugins', () => {
  describe('set-weekday', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
    });
    it('set weekDay', () => {
      const dt = new DateTime(2021, 12, 1);

      const newDate = setWeekDay(dt, 0, 0);

      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2018,
            month: 2,
            day: 28,
            hour: 12,
            minute: 34,
            second: 23,
            ms: 4,
          })
        )
      );
    });
  });
});
