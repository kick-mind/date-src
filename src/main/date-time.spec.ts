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
import { Locale,  } from '.';
import { format } from '../plugins/format';
import { locale, locales } from 'moment';
import { parse } from '../plugins/parse';
import { HijriCalendar } from '../calendars/hijri';


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
      Calendars.add(new HijriCalendar('hijri', -1));
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

    it('subtract 3 hours and 30 minutes', function () {
      const dt = new DateTime(1400, 1, 1, 0, 0, 0, 0, { calendar: 'persian' });
      const dt2 = dt.subtract({ hour: 3, minute:30 });
      debugger;
      assert.strictEqual(dt2.year, 1399);
    });

    
    it('subtract 3 hours and 30 minutes and 1 ms', function () {
      const dt = new DateTime(1400, 1, 1, 0, 0, 0, 0, { calendar: 'persian' });
      const dt2 = dt.subtract({ hour: 3, minute:30, ms: 1 });
      debugger;
      assert.strictEqual(dt2.year, 1399);
    });

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


    it('Datetime creation', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });

      const gregorianDate = new DateTime(2020, 2, 32); // now
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); // -> 2021, 10, 26

      const persianDate = new DateTime({ calendar: 'persian' }); // now
      console.log(persianDate.year, persianDate.month, persianDate.day); // -> 1400, 8, 4

      const hijriDate = new DateTime({ calendar: 'hijri' }); // now
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); // -> 1443, 1, 19

      const gregorian2Date = new DateTime({ calendar: 'gregorian2' }); // now
      console.log(
        gregorian2Date.year,
        gregorian2Date.month,
        gregorian2Date.day
      ); // -> 2021, 10, 26
    });

    it('Convert datetime', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });

      const gregorianDate = new DateTime(); // now
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); // -> 2021, 10, 26

      const persianDate = new DateTime({ calendar: 'persian' }); // now
      console.log(persianDate.year, persianDate.month, persianDate.day); // -> 1400, 8, 4

      const hijriDate = new DateTime({ calendar: 'hijri' }); // now
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); // -> 1443, 3, 19

      const gregorian2Date = new DateTime({ calendar: 'gregorian2' }); // now
      console.log(
        gregorian2Date.year,
        gregorian2Date.month,
        gregorian2Date.day
      ); // -> 2021, 10, 26
    });

    it('Change default calendar', () => {
      // the first calendar that you add to calendars pool is default calendar
      const gregorianNow = new DateTime(); // now
      console.log(gregorianNow.year, gregorianNow.month, gregorianNow.day); // -> 2021, 11, 2

      const gregorianDate = new DateTime(2021, 10, 26);
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); // -> 2021, 10, 26

      // Set persian calendar as default calendar
      Calendars.default = Calendars.find('persian');
      const persianNow = new DateTime(); // now
      console.log(persianNow.year, persianNow.month, persianNow.day); // -> 1400, 8, 11

      const persianDate = new DateTime(1400, 8, 4);
      console.log(persianDate.year, persianDate.month, persianDate.day); // -> 1400, 8, 4

      // Set persian calendar as default calendar
      Calendars.default = Calendars.find('hijri');
      const hijriNow = new DateTime(); // now
      console.log(hijriNow.year, hijriNow.month, hijriNow.day); // -> 1443, 3, 26

      const hijriDate = new DateTime(1443, 3, 19);
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); // -> 1443, 3, 19
    });

    it('Use Locale', () => {
      const d = new DateTime({
        calendar: 'hijri',
        locale: Locales.resolve('ar-AE'),
      });
      console.log(d.hour);
    });

    it('Use Zone', () => {
      const d = new DateTime({
        calendar: 'hijri',
        locale: Locales.resolve('ar-AE'),
      });
      console.log(d.hour);
    });

    it('Add Function', () => {
      const dt = new DateTime({ calendar: 'gregorian' }, 2020, 1, 1);
      const dt2 = dt.add({ day: 1 });
      console.log(dt2.year, dt2.month, dt2.day); // -> 2020, 1, 2
    });

    it('Add Subtract', () => {
      const dt = new DateTime({ calendar: 'persian' }, 1400, 1, 1);
      const dt2 = dt.subtract({ day: 1 });
      console.log(dt2.year, dt2.month, dt2.day); // -> 1399, 12, 30
    });


    it('Locale', () => {
      const javaScriptRelease = Date.parse('04 Dec 2020 00:12:00 GMT');
      const d = new DateTime(javaScriptRelease);
      console.log('year:' + d.year + ' month:' + d.month + ' day:' + d.day);
      const dt = new Date(1970, 0, 1);
      console.log('UTC-Time -> hh:' + dt.getMonth());
    });

    it('Zone', () => {
      const d = new DateTime(2000, 1, 1);
      console.log('hh:' + d.year + ' mm:' + d.minute + ' ss:' + d.second);
    });

    it('Plugins: parse', () => {
      // Import parse plugin

      // Import parse plugin

      const dt = parse('2012/2/6', 'Y/M/d');
      console.log(dt.year, dt.month, dt.day); // -> 2012, 2, 6
      const dt1 = parse('12-25-1995', 'MM-dd-YYYY');
      console.log(dt1.year, dt1.month, dt1.day); // -> 2012, 2, 6
      const dt2 = parse('99/2/6', 'YY/M/d');
      console.log(dt2.year, dt2.month, dt2.day); // -> 99, 2, 6
    });

    it('format', () => {
      const dt = new DateTime(2001, 9, 8);
      const str = format(dt, 'dd/MM/YYYY');
      console.log(str); // -> '08/09/2001'
    });


    it('change zone', () => {
      const UTC = new DateTime({ zone: Zones.utc });
      console.log('UTC-Time -> hh:' + UTC.hour + ' mm:' + UTC.minute + ' ss:' + UTC.second);

      let Tehran = UTC.toZone('Asia/Tehran');
      console.log('Tehran-Time -> hh:' + Tehran.hour + ' mm:' + Tehran.minute + ' ss:' + Tehran.second);

      const Toronto = Tehran.toZone('America/Toronto');
      console.log('Toronto-Time -> hh:' + Toronto.hour + ' mm:' + Toronto.minute + ' ss:' + Toronto.second);

      let London = Toronto.toZone('Europe/London');
      console.log('London-Time -> hh:' + London.hour + ' mm:' + London.minute + ' ss:' + London.second);
    });

    it('change locale', () => {
      // in this example default calendar is gregorian
      const frLocale = new DateTime().toLocale('fr');
      console.log(frLocale.locale.getMonthNames(frLocale.calendar)[0]);

      const deLocale = frLocale.toLocale('de');
      console.log(deLocale.locale.getMonthNames(deLocale.calendar)[0]);

      const faLocale = deLocale.toLocale('fa-IR');
      console.log(faLocale.locale.getMonthNames(faLocale.calendar)[0]);

      // convert faLocale (from Gregorian) to Persian datetime object
      const faIR = faLocale.to('persian');
      console.log(faIR.locale.getMonthNames(faIR.calendar)[0]);

      //  Calendars.add(new HijriCalendar('islamic', -1));
      //  const ar_ue = fa_IR.to('islamic');
      //  console.log(""+ ar_ue.locale.getMonthNames(ar_ue.calendar)[0]);

    });



  });

});
