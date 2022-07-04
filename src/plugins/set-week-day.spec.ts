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
    it('set weekDay1', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2022, 7, 4);

      const newDate = setWeekDay(dt, 6,0);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2022,
            month: 7,
            day: 9,
          })
        )
      );
    });

    it('set weekDay2', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2022, 7, 1);

      const newDate = setWeekDay(dt, 0,0);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2022,
            month: 6,
            day: 26,
          })
        )
      );
    });

    it('set weekDay3', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2022, 7, 16);

      const newDate = setWeekDay(dt, 4,0);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2022,
            month: 7,
            day: 14,
          })
        )
      );
    });

    it('set weekDay4', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2022, 7, 17);

      const newDate = setWeekDay(dt, 6,0);
      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);
      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2022,
            month: 7,
            day: 23,
          })
        )
      );


    });

    it('set weekDay5', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2022, 8, 1);

      const newDate = setWeekDay(dt, 0,0);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2022,
            month: 7,
            day: 31,
          })
        )
      );
    });

    it('setDay 1', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2014, 9, 1);
      const newDate = setWeekDay(dt, 0,0);
      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2014,
            month: 8,
            day: 31,
          })
        )
      );
    });

    it('setDay 2', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2014, 9, 1);
      const newDate = setWeekDay(dt, 0,1);
      console.log(newDate.year + ' ' + newDate.month + ' ' + newDate.day);

      assert.strictEqual(
        true,
        isSame(
          newDate,
          dt.clone({
            year: 2014,
            month: 9,
            day: 7,
          })
        )
      );
    });

  });
});
