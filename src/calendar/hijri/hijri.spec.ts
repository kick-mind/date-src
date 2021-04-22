import assert from 'assert';
import { DateTimeUnits } from '../../common';
import { HijriCalendar } from './hijri';

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

    assert.strictEqual(hc.weekDay(time), 0);

    time = hc.getTimestamp({
      year: 1442,
      month: 9,
      day: 14,
      hour: 23,
      minute: 30,
      second: 32,
      ms: 500,
    });

    assert.strictEqual(hc.weekDay(time), 1);
    time = hc.getTimestamp({
      year: 1442,
      month: 9,
      day: 15,
      hour: 23,
      minute: 30,
      second: 32,
      ms: 500,
    });

    assert.strictEqual(hc.weekDay(time), 6);
  });

  it('weekNumber', function () {
    let time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.weekNumber(time, 6), 1);

    time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 6,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.weekNumber(time, 6), 1);

    time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 7,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.weekNumber(time, 6), 2);

    time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 13,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.weekNumber(time, 6), 2);

    time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 14,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.weekNumber(time, 6), 3);
  });

  it('dayOfYear', function () {
    let time = hc.getTimestamp({
      year: 1399,
      month: 12,
      day: 30,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.dayOfYear(time), 366);

    time = hc.getTimestamp({
      year: 1399,
      month: 12,
      day: 29,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.dayOfYear(time), 365);

    time = hc.getTimestamp({
      year: 1400,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    });

    assert.strictEqual(hc.dayOfYear(time), 1);
  });

  it('daysInMonth', function () {
    assert.strictEqual(hc.daysInMonth(1399, 1), 31);
    assert.strictEqual(hc.daysInMonth(1399, 2), 31);
    assert.strictEqual(hc.daysInMonth(1399, 3), 31);
    assert.strictEqual(hc.daysInMonth(1399, 4), 31);
    assert.strictEqual(hc.daysInMonth(1399, 5), 31);
    assert.strictEqual(hc.daysInMonth(1399, 6), 31);
    assert.strictEqual(hc.daysInMonth(1399, 7), 30);
    assert.strictEqual(hc.daysInMonth(1399, 8), 30);
    assert.strictEqual(hc.daysInMonth(1399, 9), 30);
    assert.strictEqual(hc.daysInMonth(1399, 10), 30);
    assert.strictEqual(hc.daysInMonth(1399, 11), 30);
    assert.strictEqual(hc.daysInMonth(1399, 12), 30);
    assert.strictEqual(hc.daysInMonth(1400, 1), 31);
    assert.strictEqual(hc.daysInMonth(1400, 12), 29);
    assert.strictEqual(hc.daysInMonth(1403, 12), 30);
  });

  it('daysInYear', function () {
    assert.strictEqual(hc.daysInYear(1390), 365);
    assert.strictEqual(hc.daysInYear(1391), 366);
    assert.strictEqual(hc.daysInYear(1392), 365);
    assert.strictEqual(hc.daysInYear(1393), 365);
    assert.strictEqual(hc.daysInYear(1394), 365);
    assert.strictEqual(hc.daysInYear(1395), 366);
    assert.strictEqual(hc.daysInYear(1396), 365);
    assert.strictEqual(hc.daysInYear(1397), 365);
    assert.strictEqual(hc.daysInYear(1398), 365);
    assert.strictEqual(hc.daysInYear(1399), 366);
    assert.strictEqual(hc.daysInYear(1400), 365);
    assert.strictEqual(hc.daysInYear(1401), 365);
    assert.strictEqual(hc.daysInYear(1402), 365);
    assert.strictEqual(hc.daysInYear(1403), 366);
    assert.strictEqual(hc.daysInYear(1404), 365);
    assert.strictEqual(hc.daysInYear(1405), 365);
    assert.strictEqual(hc.daysInYear(1406), 365);
    assert.strictEqual(hc.daysInYear(1407), 365);
  });

  it('isLeapYear', function () {
    assert.strictEqual(hc.isLeapYear(1390), false);
    assert.strictEqual(hc.isLeapYear(1391), true);
    assert.strictEqual(hc.isLeapYear(1392), false);
    assert.strictEqual(hc.isLeapYear(1393), false);
    assert.strictEqual(hc.isLeapYear(1394), false);
    assert.strictEqual(hc.isLeapYear(1395), true);
    assert.strictEqual(hc.isLeapYear(1396), false);
    assert.strictEqual(hc.isLeapYear(1397), false);
    assert.strictEqual(hc.isLeapYear(1398), false);
    assert.strictEqual(hc.isLeapYear(1399), true);
    assert.strictEqual(hc.isLeapYear(1400), false);
    assert.strictEqual(hc.isLeapYear(1401), false);
    assert.strictEqual(hc.isLeapYear(1402), false);
    assert.strictEqual(hc.isLeapYear(1403), true);
    assert.strictEqual(hc.isLeapYear(1404), false);
    assert.strictEqual(hc.isLeapYear(1405), false);
    assert.strictEqual(hc.isLeapYear(1406), false);
    assert.strictEqual(hc.isLeapYear(1407), false);
  });

  it('getTimestamp', function () {
    let time = hc.getTimestamp({
      year: 1400,
      month: 2,
      day: 2,
      hour: 17,
      minute: 12,
      second: 3,
      ms: 3,
    });

    let units = hc.getUnits(time);
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
    let units = hc.getUnits(1619111523003);
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
