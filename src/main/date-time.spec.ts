import assert from 'assert';
import { Locales } from './locale';
import { FixedZone, Zone, Zones } from './zone';
import { DateTime } from './date-time';
import moment from 'moment';
import { Calendars } from './calendar';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { PersianCalendar } from '../calendars/persian';
import momentJalaali from 'moment-jalaali';

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

describe('Main', () => {
  describe('DateTime', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('Misc tests', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });
      console.log(d.year);
    });

    it('can create without parameter', () => {
      const d = new Date();
      const dt = new DateTime(); // (local time zone, system locale, default calendar)
      assertDateEquality(d, dt);
    });

    it('create with UTC zone (system locale, default calendar)', () => {
      const d = new Date();
      const dt = new DateTime({ zone: Zones.utc });
      assertUtcDateEquality(d, dt);
    });

    it('create from timestamp (local time zone, system locale, default calendar)', () => {
      const d = new Date();
      const dt = new DateTime(d.valueOf());
      assertDateEquality(d, dt);
    });

    it('can be created from options', () => {
      const calendar = Calendars.find('persian');
      const dateTime = new DateTime({ zone: Zones.local, calendar, locale: 'fa-IR' });

      const momentDate = momentJalaali();
      assert.deepStrictEqual(
        [
          dateTime.year,
          dateTime.month,
          dateTime.day,
        ],
        [
          momentDate.jYear(),
          momentDate.jMonth() + 1,
          momentDate.jDate(),
        ]
      );
    });

    it('can be created from years, month, day, ...', () => {
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


    it('can add', () => {
      const dt = new DateTime();

      const yrand = Math.floor(Math.random() * 100);
      const mrand = Math.floor(Math.random() * 100);
      const drand = Math.floor(Math.random() * 1000);

      // add some randome numbers to datetime
      let fdt = dt.add({ year: yrand, month: mrand, day: drand });

      let d = new Date();
      d.setDate(d.getDate() + drand);
      d.setMonth(d.getMonth() + mrand);
      d.setFullYear(d.getFullYear() + yrand);

      // compare with javascript date
      assert.strictEqual(d.getFullYear(), fdt.year);
      assert.strictEqual(d.getMonth() + 1, fdt.month);
      assert.strictEqual(d.getDate(), fdt.day);
    });

    it('subtract 1 ms', function () {
      const dt = new DateTime(1400, 1, 1, 0, 0, 0, 0, { calendar: 'persian' });
      const dt2 = dt.subtract({  ms: 1 });
      debugger;
      assert.strictEqual(dt2.year, 1399);
    });

    // it('subtract 7 hours and 1 ms', function () {
    //   const dt = new DateTime(1400, 1, 1, 0, 0, 0, 0, { calendar: 'persian' });
    //   const dt2 = dt.subtract({ hour: 7, ms: 1 });
    //   debugger;
    //   assert.strictEqual(dt2.year, 1399);
    // });

    it('subtract', () => {
      const dt = new DateTime();

      const yrand = Math.floor(Math.random() * 100);
      const mrand = Math.floor(Math.random() * 100);
      const drand = Math.floor(Math.random() * 1000);

      // subtract some randome numbers to datetime
      let fdt = dt.subtract({ year: yrand, month: mrand, day: drand });

      let d = new Date();
      d.setDate(d.getDate() - drand);
      d.setMonth(d.getMonth() - mrand);
      d.setFullYear(d.getFullYear() - yrand);

      // compare with javascript date
      assert.strictEqual(d.getFullYear(), fdt.year);
      assert.strictEqual(d.getMonth() + 1, fdt.month);
      assert.strictEqual(d.getDate(), fdt.day);
    });

    it('toUTC: compare with moment equivalent method at moment', () => {
      const dt = new DateTime();
      let utc = dt.toUtc();

      let mUtc = moment.utc(new Date()).toDate();

      const md = `${utc.year}-${utc.month}-${utc.day}`;
      const dtd = `${mUtc.getFullYear()}-${mUtc.getMonth() + 1
        }-${mUtc.getDate()}`;

      assert.strictEqual(md, dtd);
    });

    it('toLocal: compare with moment equivalent method at moment', () => {
      const dt = new DateTime();
      let local = dt.toLocal();

      let stillUtc = moment.utc(new Date()).toDate();
      let mlocal = moment(stillUtc).local().format('YYYY-M-D');

      const ld = `${local.year}-${local.month}-${local.day}`;
      assert.strictEqual(ld, mlocal);
    });

    it('toLocale', () => {
      const ro = new DateTime().toLocale('ro');
      const ianuarie = ro.locale.getMonthNames(ro.calendar)[0];

      const de = new DateTime().toLocale('de');
      const Januar = de.locale.getMonthNames(de.calendar)[0];

      assert.strictEqual('ianuarie', ianuarie);
      assert.strictEqual('Januar', Januar);
    });

    it('toZone', () => {
      const dt = new DateTime();
      let Tokyo = dt.toZone('Asia/Tokyo');
      assert.strictEqual('Asia/Tokyo', Tokyo.zone.name);
    });

    it('toCalendar', () => {
      const dt = new DateTime();
      const persian = dt.to('persian');
      assert.strictEqual('persian', persian.calendar.type);
    });

    it('can clone', () => {
      const d1 = new DateTime();
      const d2 = d1.clone();
      assert.deepStrictEqual(d1, d2);

      const d3 = new DateTime(1400, 10, 9);
      const d4 = d3.clone({ year: 1401 });
      assert.deepStrictEqual([d4.year, d4.month, d4.day], [1401, d3.month, d3.day]);


    });


    it('can convert DateTime to object', () => {
      const dt = new DateTime({ zone: Zones.utc });
      const newZone = dt.toZone('Asia/Tehran');
      const newDt = newZone.toObject();

      assert.strictEqual(newZone.day, newDt.day);
      assert.strictEqual(newZone.month, newDt.month);
      assert.strictEqual(newZone.year, newDt.year);
      assert.strictEqual(newZone.hour, newDt.hour);
    });

    it('create new object', () => {
      const dt = new DateTime(1609446600000, {
        zone: 'Asia/Tehran',
      });
      const d2 = dt.toZone(Zones.utc);
      const d3 = d2.toObject();
      // assert.strictEqual(newZone.day, newDt.day);
    });

    it('can create an "invalid" DateTime', () => {
      const d = new DateTime({ calendar: 'persian' }, 1400, -1, -1);
    });

    it('can create a date with a custom week start', () => {
      const d = new DateTime({ calendar: 'persian', locale: { name: 'fa', weekStart: 6 } }, 1400, 1);
      assert.strictEqual(d.locale.weekStart, 6);
    });

  });

});
