import assert from "assert";
import { Locales } from "../locale";
import { Zones } from "../zone";
import { DateTime } from "./date-time";
import moment from "moment";

function assertDateEquality(date: Date, dateTime: DateTime) {
  assert.deepStrictEqual(
    [
      dateTime.year,
      dateTime.month,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.ms,
    ],
    [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ]
  );
}

function assertUtcDateEquality(date: Date, dateTime: DateTime) {
  assert.deepStrictEqual(
    [
      dateTime.year,
      dateTime.month,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.ms,
    ],
    [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ]
  );
}

describe("DateTime", () => {
  it("create without parameter (local time zone, system locale, default calendar)", () => {
    const d = new Date();
    const dt = new DateTime();
    assertDateEquality(d, dt);
  });

  it("create with UTC zone (system locale, default calendar)", () => {
    const d = new Date();
    const dt = new DateTime({ zone: Zones.utc });
    assertUtcDateEquality(d, dt);
  });

  it("create from timestamp (local time zone, system locale, default calendar)", () => {
    const d = new Date();
    const dt = new DateTime(d.valueOf());
    assertDateEquality(d, dt);
  });

  it("can be created from years, month, day, ...", () => {
    const d = new Date();
    const dt = new DateTime(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    );
    assertDateEquality(d, dt);
  });

  it("add", () => {
    const dt = new DateTime();

    const yrand = Math.floor(Math.random() * 100);
    const mrand = Math.floor(Math.random() * 100);
    const drand = Math.floor(Math.random() * 1000);

    // add some randome numbers to datetime
    var fdt = dt.add({ year: yrand, month: mrand, day: drand });

    var d = new Date();
    d.setDate(d.getDate() + drand);
    d.setMonth(d.getMonth() + mrand);
    d.setFullYear(d.getFullYear() + yrand);

    // compare with javascript date
    assert.strictEqual(d.getFullYear(), fdt.year);
    assert.strictEqual(d.getMonth() + 1, fdt.month);
    assert.strictEqual(d.getDate(), fdt.day);
  });

  it("subtract", () => {
    const dt = new DateTime();

    const yrand = Math.floor(Math.random() * 100);
    const mrand = Math.floor(Math.random() * 100);
    const drand = Math.floor(Math.random() * 1000);

    // subtract some randome numbers to datetime
    var fdt = dt.subtract({ year: yrand, month: mrand, day: drand });

    var d = new Date();
    d.setDate(d.getDate() - drand);
    d.setMonth(d.getMonth() - mrand);
    d.setFullYear(d.getFullYear() - yrand);

    // compare with javascript date
    assert.strictEqual(d.getFullYear(), fdt.year);
    assert.strictEqual(d.getMonth() + 1, fdt.month);
    assert.strictEqual(d.getDate(), fdt.day);
  });

  it("toUTC: compare with moment equivalent method at moment", () => {
    const dt = new DateTime();
    var utc = dt.toUtc();

    var mUtc = moment.utc(new Date()).toDate();

    const md = `${utc.year}-${utc.month}-${utc.day}`;
    const dtd = `${mUtc.getFullYear()}-${
      mUtc.getMonth() + 1
    }-${mUtc.getDate()}`;

    assert.strictEqual(md, dtd);
  });

  it("toLocal: compare with moment equivalent method at moment", () => {
    const dt = new DateTime();
    var local = dt.toLocal();

    var stillUtc = moment.utc(new Date()).toDate();
    var mlocal = moment(stillUtc).local().format("YYYY-M-D");

    const ld = `${local.year}-${local.month}-${local.day}`;
    assert.strictEqual(ld, mlocal);
  });

  it("toLocale: compare with moment equivalent method at javascript", () => {
    const dt = new DateTime();
    var local = dt.toLocale("IR-fa");
    var a = 1;
  });
});
