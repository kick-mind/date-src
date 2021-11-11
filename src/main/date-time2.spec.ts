import assert from 'assert';
import { Locales } from '.';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { HijriCalendar } from '../calendars/hijri';
import { PersianCalendar } from '../calendars/persian';
import { Calendars } from './calendar/calendars';
import { DateTime } from './date-time';
import { format } from '../plugins/format';

describe('Main', () => {
  describe('DateTime2', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new HijriCalendar('hijri', -1));
    });

    it('Datetime creation', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });

      const gregorianDate = new DateTime(); // now
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); //-> 2021, 10, 26

      const persianDate = new DateTime({ calendar: 'persian' }); //now
      console.log(persianDate.year, persianDate.month, persianDate.day); //-> 1400, 8, 4

      const hijriDate = new DateTime({ calendar: 'hijri' }); //now
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); //-> 1443, 1, 19

      const gregorian2Date = new DateTime({ calendar: 'gregorian2' }); //now
      console.log(
        gregorian2Date.year,
        gregorian2Date.month,
        gregorian2Date.day
      ); //-> 2021, 10, 26
    });

    it('Convert datetime', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });

      const gregorianDate = new DateTime(); // now
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); //-> 2021, 10, 26

      const persianDate = new DateTime({ calendar: 'persian' }); //now
      console.log(persianDate.year, persianDate.month, persianDate.day); //-> 1400, 8, 4

      const hijriDate = new DateTime({ calendar: 'hijri' }); //now
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); //-> 1443, 3, 19

      const gregorian2Date = new DateTime({ calendar: 'gregorian2' }); //now
      console.log(
        gregorian2Date.year,
        gregorian2Date.month,
        gregorian2Date.day
      ); //-> 2021, 10, 26
    });

    it('Change default calendar', () => {
      // the first calendar that you add to calendars pool is default calendar
      const gregorianNow = new DateTime(); // now
      console.log(gregorianNow.year, gregorianNow.month, gregorianNow.day); //-> 2021, 11, 2

      const gregorianDate = new DateTime(2021, 10, 26); 
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); //-> 2021, 10, 26

      // Set persian calendar as default calendar
      Calendars.default = Calendars.find('persian');
      const persianNow = new DateTime(); //now
      console.log(persianNow.year, persianNow.month, persianNow.day); //-> 1400, 8, 11

      const persianDate = new DateTime(1400, 8, 4); 
      console.log(persianDate.year, persianDate.month, persianDate.day); //-> 1400, 8, 4

      // Set persian calendar as default calendar
      Calendars.default = Calendars.find('hijri');
      const hijriNow = new DateTime(); //now
      console.log(hijriNow.year, hijriNow.month, hijriNow.day); //-> 1443, 3, 26

      const hijriDate = new DateTime(1443,3,19); 
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); //-> 1443, 3, 19
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
      const dt = new DateTime( { calendar: 'gregorian' }, 2020,1,1);
      const dt2 = dt.add({ day: 1 });
      console.log(dt2.year, dt2.month, dt2.day); //-> 2020, 1, 2
    });

    it('Add Subtract', () => {
      const dt = new DateTime({ calendar: 'persian'}, 1400,1,1 );
      const dt2 = dt.subtract({ day: 1 });
      console.log(dt2.year, dt2.month, dt2.day); //-> 1399, 12, 30
    });

   
    it('Locale', () => {
   
    });

    it('Zone', () => {
   
    });

    it('Plugins: parse', () => {
   
    });

    it('format', () => {
      const dt = new DateTime(2001, 9, 8);
      const str = format(dt, 'dd/MM/YYYY');
      console.log(str); //-> '08/09/2001'
    });
  });
});
