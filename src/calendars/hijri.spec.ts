import assert from 'assert';
import { DateTimeUnits } from '../common';
import { HijriCalendar } from './hijri';

describe('Calendars', () => {
  describe('HijriCalendar', () => {
    const hc = new HijriCalendar('hijri', 0);

    it('add', function () {
      let time = hc.getTimestamp({
        year: 1190,
        month: 6,
        day: 29,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      time = hc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = hc.add(time, {
        year: 148,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = hc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1442,
        month: 4,
        day: 26,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      } as DateTimeUnits);
    });

    it('subtract', function () {
      let time = hc.getTimestamp({
        year: 1393,
        month: 4,
        day: 3,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      });

      time = hc.subtract(time, {
        year: 144,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = hc.subtract(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = hc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1145,
        month: 6,
        day: 5,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      } as DateTimeUnits);
    });

    it('validate date', function () {
      assert.strictEqual(hc.isValid(1441, 12, 29), true);
      assert.strictEqual(hc.isValid(1441, 12, 30), false);
      assert.strictEqual(hc.isValid(1441, 12, 0), false);
      assert.strictEqual(hc.isValid(1441, 0, 20), false);
      assert.strictEqual(hc.isValid(0, 12, 20), false);
    });

    it('weekDay', function () {
      let time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 11,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(hc.weekDay(time), 4);

      time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 12,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(hc.weekDay(time), 5);

      time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 13,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(hc.weekDay(time), 6);

      time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 14,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(hc.weekDay(time), 0);
      time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 15,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(hc.weekDay(time), 1);
    });

    it('weekNumber', function () {
      let time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.weekNumber(time, 6), 1);

      time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.weekNumber(time, 6), 1);

      time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 8,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.weekNumber(time, 6), 2);

      time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 9,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.weekNumber(time, 6), 2);

      time = hc.getTimestamp({
        year: 1400,
        month: 1,
        day: 15,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.weekNumber(time, 6), 3);
    });

    it('dayOfYear', function () {
      let time = hc.getTimestamp({
        year: 1441,
        month: 12,
        day: 29,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.dayOfYear(time), 354);

      time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.dayOfYear(time), 1);

      time = hc.getTimestamp({
        year: 1442,
        month: 1,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(hc.dayOfYear(time), 2);
    });

    it('daysInMonth', function () {
      assert.strictEqual(hc.daysInMonth(1442, 1), 30);
      assert.strictEqual(hc.daysInMonth(1442, 2), 29);
      assert.strictEqual(hc.daysInMonth(1442, 3), 30);
      assert.strictEqual(hc.daysInMonth(1442, 4), 29);
      assert.strictEqual(hc.daysInMonth(1442, 5), 30);
      assert.strictEqual(hc.daysInMonth(1442, 6), 29);
      assert.strictEqual(hc.daysInMonth(1442, 7), 30);
      assert.strictEqual(hc.daysInMonth(1442, 8), 29);
      assert.strictEqual(hc.daysInMonth(1442, 9), 30);
      assert.strictEqual(hc.daysInMonth(1442, 10), 29);
      assert.strictEqual(hc.daysInMonth(1442, 11), 30);
      assert.strictEqual(hc.daysInMonth(1442, 12), 30);

    });

    it('daysInYear', function () {
      assert.strictEqual(hc.daysInYear(1441), 354);
      assert.strictEqual(hc.daysInYear(1442), 355);
      assert.strictEqual(hc.daysInYear(1443), 354);
      assert.strictEqual(hc.daysInYear(1444), 354);
      assert.strictEqual(hc.daysInYear(1445), 355);
      assert.strictEqual(hc.daysInYear(1446), 354);
      assert.strictEqual(hc.daysInYear(1447), 355);
      assert.strictEqual(hc.daysInYear(1448), 354);
      assert.strictEqual(hc.daysInYear(1449), 354);
      assert.strictEqual(hc.daysInYear(1450), 355);
      assert.strictEqual(hc.daysInYear(1451), 354);
      assert.strictEqual(hc.daysInYear(1452), 354);
    });

    it('isLeapYear', function () {
      assert.strictEqual(hc.isLeapYear(1441), false);
      assert.strictEqual(hc.isLeapYear(1442), true);
      assert.strictEqual(hc.isLeapYear(1443), false);
      assert.strictEqual(hc.isLeapYear(1444), false);
      assert.strictEqual(hc.isLeapYear(1445), true);
      assert.strictEqual(hc.isLeapYear(1446), false);
      assert.strictEqual(hc.isLeapYear(1447), true);
      assert.strictEqual(hc.isLeapYear(1448), false);
      assert.strictEqual(hc.isLeapYear(1449), false);
      assert.strictEqual(hc.isLeapYear(1450), true);
      assert.strictEqual(hc.isLeapYear(1451), false);
      assert.strictEqual(hc.isLeapYear(1452), false);

    });

    it('getTimestamp', function () {
      let time = hc.getTimestamp({
        year: 1442,
        month: 9,
        day: 9,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      });

      let units = hc.getUnits(time);
      assert.deepStrictEqual(units, {
        year: 1442,
        month: 9,
        day: 9,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });

    it('getUnits', function () {
      let units = hc.getUnits(1618938723003);
      assert.deepStrictEqual(units, {
        year: 1442,
        month: 9,
        day: 9,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });
  });

});

