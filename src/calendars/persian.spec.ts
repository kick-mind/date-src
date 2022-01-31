import assert from 'assert';
import { DateTimeUnits } from '../common';
import { PersianCalendar } from './persian';

describe('Calendars', () => {
  describe('PersianCalendar', () => {
    const pc = new PersianCalendar('persian');
    it('add', function () {
      let time = pc.getTimestamp({
        year: 1190,
        month: 6,
        day: 30,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      time = pc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = pc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = pc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1393,
        month: 4,
        day: 3,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      } as DateTimeUnits);
    });

    it('add2', function () {
      let time = pc.getTimestamp({
        year: 1190,
        month: 6,
        day: 30,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 501,
      });

      time = pc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = pc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = pc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1393,
        month: 4,
        day: 3,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 609,
      } as DateTimeUnits);
    });

    it('subtract', function () {
      let time = pc.getTimestamp({
        year: 1393,
        month: 4,
        day: 3,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      });

      time = pc.subtract(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = pc.subtract(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = pc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1186,
        month: 7,
        day: 2,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      } as DateTimeUnits);
    });

    it('validate date', function () {
      assert.strictEqual(pc.isValid(1399, 12, 30), true);
      assert.strictEqual(pc.isValid(1399, 12, 31), false);
      assert.strictEqual(pc.isValid(1400, 12, 29), true);
      assert.strictEqual(pc.isValid(1400, 12, 30), false);
      assert.strictEqual(pc.isValid(1400, 0, 29), false);
      assert.strictEqual(pc.isValid(1400, 13, 29), false);
      assert.strictEqual(pc.isValid(11400, 1, 29), false);
    });

    it('weekDay', function () {
      let time = pc.getTimestamp({
        year: 1399,
        month: 12,
        day: 30,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(pc.weekDay(time), 6);

      time = pc.getTimestamp({
        year: 1364,
        month: 7,
        day: 10,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekDay(time), 3);

      time = pc.getTimestamp({
        year: 1400,
        month: 2,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekDay(time), 4);

      time = pc.getTimestamp({
        year: 1422,
        month: 12,
        day: 16,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekDay(time), 0);
    });

    it('weekNumber2', function () {
      let time = pc.getTimestamp({
        year: 1399,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });
      const r = pc.weekNumber(time, 6);
      assert.strictEqual(r, 1);
    });
    it('weekNumber', function () {
      let time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekNumber(time, 6), 1);

      time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 6,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekNumber(time, 6), 1);

      time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 7,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekNumber(time, 6), 2);

      time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 13,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekNumber(time, 6), 2);

      time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 14,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.weekNumber(time, 6), 3);
    });

    it('dayOfYear', function () {
      let time = pc.getTimestamp({
        year: 1399,
        month: 12,
        day: 30,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.dayOfYear(time), 366);

      time = pc.getTimestamp({
        year: 1399,
        month: 12,
        day: 29,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.dayOfYear(time), 365);

      time = pc.getTimestamp({
        year: 1400,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(pc.dayOfYear(time), 1);
    });

    it('daysInMonth', function () {
      assert.strictEqual(pc.daysInMonth(1399, 1), 31);
      assert.strictEqual(pc.daysInMonth(1399, 2), 31);
      assert.strictEqual(pc.daysInMonth(1399, 3), 31);
      assert.strictEqual(pc.daysInMonth(1399, 4), 31);
      assert.strictEqual(pc.daysInMonth(1399, 5), 31);
      assert.strictEqual(pc.daysInMonth(1399, 6), 31);
      assert.strictEqual(pc.daysInMonth(1399, 7), 30);
      assert.strictEqual(pc.daysInMonth(1399, 8), 30);
      assert.strictEqual(pc.daysInMonth(1399, 9), 30);
      assert.strictEqual(pc.daysInMonth(1399, 10), 30);
      assert.strictEqual(pc.daysInMonth(1399, 11), 30);
      assert.strictEqual(pc.daysInMonth(1399, 12), 30);
      assert.strictEqual(pc.daysInMonth(1400, 1), 31);
      assert.strictEqual(pc.daysInMonth(1400, 12), 29);
      assert.strictEqual(pc.daysInMonth(1403, 12), 30);
    });

    it('daysInYear', function () {
      assert.strictEqual(pc.daysInYear(1390), 365);
      assert.strictEqual(pc.daysInYear(1391), 366);
      assert.strictEqual(pc.daysInYear(1392), 365);
      assert.strictEqual(pc.daysInYear(1393), 365);
      assert.strictEqual(pc.daysInYear(1394), 365);
      assert.strictEqual(pc.daysInYear(1395), 366);
      assert.strictEqual(pc.daysInYear(1396), 365);
      assert.strictEqual(pc.daysInYear(1397), 365);
      assert.strictEqual(pc.daysInYear(1398), 365);
      assert.strictEqual(pc.daysInYear(1399), 366);
      assert.strictEqual(pc.daysInYear(1400), 365);
      assert.strictEqual(pc.daysInYear(1401), 365);
      assert.strictEqual(pc.daysInYear(1402), 365);
      assert.strictEqual(pc.daysInYear(1403), 366);
      assert.strictEqual(pc.daysInYear(1404), 365);
      assert.strictEqual(pc.daysInYear(1405), 365);
      assert.strictEqual(pc.daysInYear(1406), 365);
      assert.strictEqual(pc.daysInYear(1407), 365);
    });

    it('isLeapYear', function () {
      assert.strictEqual(pc.isLeapYear(1390), false);
      assert.strictEqual(pc.isLeapYear(1391), true);
      assert.strictEqual(pc.isLeapYear(1392), false);
      assert.strictEqual(pc.isLeapYear(1393), false);
      assert.strictEqual(pc.isLeapYear(1394), false);
      assert.strictEqual(pc.isLeapYear(1395), true);
      assert.strictEqual(pc.isLeapYear(1396), false);
      assert.strictEqual(pc.isLeapYear(1397), false);
      assert.strictEqual(pc.isLeapYear(1398), false);
      assert.strictEqual(pc.isLeapYear(1399), true);
      assert.strictEqual(pc.isLeapYear(1400), false);
      assert.strictEqual(pc.isLeapYear(1401), false);
      assert.strictEqual(pc.isLeapYear(1402), false);
      assert.strictEqual(pc.isLeapYear(1403), true);
      assert.strictEqual(pc.isLeapYear(1404), false);
      assert.strictEqual(pc.isLeapYear(1405), false);
      assert.strictEqual(pc.isLeapYear(1406), false);
      assert.strictEqual(pc.isLeapYear(1407), false);
    });

    it('getTimestamp', function () {
      let time = pc.getTimestamp({
        year: 1400,
        month: 2,
        day: 2,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      });

      let units = pc.getUnits(time);
      assert.deepStrictEqual(units, {
        year: 1400,
        month: 2,
        day: 2,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });

    it('getUnits', function () {
      let units = pc.getUnits(1619111523003);
      assert.deepStrictEqual(units, {
        year: 1400,
        month: 2,
        day: 2,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });
  });

});


