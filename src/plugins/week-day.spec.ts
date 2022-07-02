import assert from 'assert';
import { weekDay } from './week-day';
import { Calendars, DateTime } from '../main';
import { PersianCalendar } from '../calendars/persian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { GregorianCalendar } from '../calendars/gregorian';

describe('Plugins', () => {
  describe('weekDay', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('tset persian weekDay', () => {
      const d = new DateTime(
        { locale: 'fa', calendar: 'persian' },
        1400,
        10,
        19
      );
      assert.strictEqual(weekDay(d), 0);
    });

    it('tset persian weekDay2', () => {
      const d = new DateTime({ locale: 'fa', calendar: 'persian' }, 1400, 9, 8);
      assert.strictEqual(weekDay(d), 1);
    });

    it('test gregorian weekDay', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 1, 9);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 0);
    });

    it('test gregorian weekDay2', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2021, 9, 21);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 2);
    });

    it('test gregorian weekDay3', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 1, 1);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 6);
    });

    it('test weekDay 0', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 3);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 0);
    });

    it('test weekDay 1', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 4);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 1);
    });
    it('test weekDay 2', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 5);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 2);
    });
    it('test weekDay 3', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 6);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 3);
    });
    it('test weekDay 4', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 7);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 4);
    });
    it('test weekDay 5', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 8);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 5);
    });
    it('test weekDay 6', () => {
      const d = new DateTime({ calendar: 'gregorian' }, 2022, 7, 9);
      let x = weekDay(d);
      assert.strictEqual(weekDay(d), 6);
    });

   
  });
});
