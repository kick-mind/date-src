import assert from 'assert';
import { DateTimeUnits } from '../../common';
import { PersianCalendar } from './persian';

describe('PersianCalendar', () => {
  const pc = new PersianCalendar('persian');
  it('can add', function () {
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

  it('can subtract', function () {
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
      year: 1190,
      month: 7,
      day: 1,
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
  // it('can compute units from ts', function () {
  //   assert.strictEqual(pc.getUnits(100000), {
  //     year: 2,
  //     month: 1,
  //     day: 1,
  //     hour: 1,
  //     minute: 1,
  //     second: 1,
  //     ms: 1,
  //   } as DateTimeUnits);
  // });

  it('can compute ts from units', function () {});

  it('can compute leap year', function () {});
});
