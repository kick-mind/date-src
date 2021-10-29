import assert from "assert";
import { DateTimeUnits } from "../common";
import { GregorianCalendar2 } from "./gregorian2";


describe('Calendars', () => {
  describe("GregorianCalendar2", () => {
    const gc = new GregorianCalendar2("gregorian2");
    it("add", function () {
      let time = gc.getTimestamp({
        year: 1190,
        month: 6,
        day: 30,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      time = gc.add(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = gc.add(time, {
        year: 727,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = gc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 2021,
        month: 4,
        day: 1,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      } as DateTimeUnits);
    });

    it("subtract", function () {
      let time = gc.getTimestamp({
        year: 2021,
        month: 4,
        day: 1,
        hour: 0,
        minute: 39,
        second: 43,
        ms: 608,
      });

      time = gc.subtract(time, {
        year: 99,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      time = gc.subtract(time, {
        year: 727,
        month: 15,
        day: 400,
        hour: 260,
        minute: 796,
        second: 2059,
        ms: 9856554,
      });

      let units = gc.getUnits(time);

      assert.deepStrictEqual(units, {
        year: 1190,
        month: 6,
        day: 28,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      } as DateTimeUnits);
    });

    it("validate date", function () {
      assert.strictEqual(gc.isValid(2021, 1, 30), true);
      assert.strictEqual(gc.isValid(2021, 1, 31), true);
      assert.strictEqual(gc.isValid(2021, 2, 29), false);
      assert.strictEqual(gc.isValid(2021, 2, 30), false);
      assert.strictEqual(gc.isValid(2021, 2, 31), false);
      assert.strictEqual(gc.isValid(2021, 3, 29), true);
      assert.strictEqual(gc.isValid(2021, 3, 30), true);
      assert.strictEqual(gc.isValid(2021, 3, 31), true);
      assert.strictEqual(gc.isValid(2021, 4, 30), true);
      assert.strictEqual(gc.isValid(2021, 4, 31), false);
      assert.strictEqual(gc.isValid(2021, 5, 29), true);
      assert.strictEqual(gc.isValid(2021, 5, 30), true);
      assert.strictEqual(gc.isValid(2021, 5, 31), true);
      assert.strictEqual(gc.isValid(2021, 6, 30), true);
      assert.strictEqual(gc.isValid(2021, 6, 31), false);
      assert.strictEqual(gc.isValid(2021, 7, 30), true);
      assert.strictEqual(gc.isValid(2021, 7, 31), true);
      assert.strictEqual(gc.isValid(2021, 8, 30), true);
      assert.strictEqual(gc.isValid(2021, 8, 31), true);
      assert.strictEqual(gc.isValid(2021, 9, 30), true);
      assert.strictEqual(gc.isValid(2021, 9, 31), false);
      assert.strictEqual(gc.isValid(2021, 10, 30), true);
      assert.strictEqual(gc.isValid(2021, 10, 31), true);
      assert.strictEqual(gc.isValid(2021, 11, 30), true);
      assert.strictEqual(gc.isValid(2021, 11, 31), false);
      assert.strictEqual(gc.isValid(2021, 12, 30), true);
      assert.strictEqual(gc.isValid(2021, 12, 31), true);
    });

    it("weekDay", function () {
      let time = gc.getTimestamp({
        year: 2020,
        month: 12,
        day: 31,
        hour: 23,
        minute: 30,
        second: 32,
        ms: 500,
      });

      assert.strictEqual(gc.weekDay(time), 4);

      time = gc.getTimestamp({
        year: 1985,
        month: 10,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekDay(time), 3);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekDay(time), 5);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 31,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekDay(time), 0);
    });

    it("weekNumber", function () {
      let time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekNumber(time, 0), 1);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 3,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekNumber(time, 0), 2);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 9,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekNumber(time, 0), 2);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 10,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekNumber(time, 0), 3);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 16,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.weekNumber(time, 0), 3);
    });

    it("dayOfYear", function () {
      let time = gc.getTimestamp({
        year: 2020,
        month: 12,
        day: 30,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.dayOfYear(time), 365);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.dayOfYear(time), 1);

      time = gc.getTimestamp({
        year: 2021,
        month: 1,
        day: 31,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.dayOfYear(time), 31);

      time = gc.getTimestamp({
        year: 2021,
        month: 2,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.dayOfYear(time), 32);

      time = gc.getTimestamp({
        year: 2021,
        month: 12,
        day: 31,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
      });

      assert.strictEqual(gc.dayOfYear(time), 365);
    });

    it("daysInMonth", function () {
      assert.strictEqual(gc.daysInMonth(2021, 1), 31);
      assert.strictEqual(gc.daysInMonth(2021, 2), 28);
      assert.strictEqual(gc.daysInMonth(2021, 3), 31);
      assert.strictEqual(gc.daysInMonth(2021, 4), 30);
      assert.strictEqual(gc.daysInMonth(2021, 5), 31);
      assert.strictEqual(gc.daysInMonth(2021, 6), 30);
      assert.strictEqual(gc.daysInMonth(2021, 7), 31);
      assert.strictEqual(gc.daysInMonth(2021, 8), 31);
      assert.strictEqual(gc.daysInMonth(2021, 9), 30);
      assert.strictEqual(gc.daysInMonth(2021, 10), 31);
      assert.strictEqual(gc.daysInMonth(2021, 11), 30);
      assert.strictEqual(gc.daysInMonth(2021, 12), 31);
    });

    it("daysInYear", function () {
      assert.strictEqual(gc.daysInYear(2010), 365);
      assert.strictEqual(gc.daysInYear(2011), 365);
      assert.strictEqual(gc.daysInYear(2012), 366);
      assert.strictEqual(gc.daysInYear(2013), 365);
      assert.strictEqual(gc.daysInYear(2014), 365);
      assert.strictEqual(gc.daysInYear(2015), 365);
      assert.strictEqual(gc.daysInYear(2016), 366);
      assert.strictEqual(gc.daysInYear(2017), 365);
      assert.strictEqual(gc.daysInYear(2018), 365);
      assert.strictEqual(gc.daysInYear(2019), 365);
      assert.strictEqual(gc.daysInYear(2020), 366);
      assert.strictEqual(gc.daysInYear(2021), 365);
    });

    it("isLeapYear", function () {
      assert.strictEqual(gc.isLeapYear(2010), false);
      assert.strictEqual(gc.isLeapYear(2011), false);
      assert.strictEqual(gc.isLeapYear(2012), true);
      assert.strictEqual(gc.isLeapYear(2013), false);
      assert.strictEqual(gc.isLeapYear(2014), false);
      assert.strictEqual(gc.isLeapYear(2015), false);
      assert.strictEqual(gc.isLeapYear(2016), true);
      assert.strictEqual(gc.isLeapYear(2017), false);
      assert.strictEqual(gc.isLeapYear(2018), false);
      assert.strictEqual(gc.isLeapYear(2019), false);
      assert.strictEqual(gc.isLeapYear(2020), true);
      assert.strictEqual(gc.isLeapYear(2021), false);
    });

    it("getTimestamp", function () {
      let time = gc.getTimestamp({
        year: 2021,
        month: 4,
        day: 23,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      });

      let units = gc.getUnits(time);
      assert.deepStrictEqual(units, {
        year: 2021,
        month: 4,
        day: 23,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });

    it("getUnits", function () {
      let units = gc.getUnits(1619197923003);
      assert.deepStrictEqual(units, {
        year: 2021,
        month: 4,
        day: 23,
        hour: 17,
        minute: 12,
        second: 3,
        ms: 3,
      } as DateTimeUnits);
    });

  });

});
