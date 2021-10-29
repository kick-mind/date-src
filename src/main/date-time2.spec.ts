import assert from 'assert';
import { Locales } from '.';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { HijriCalendar } from '../calendars/hijri';
import { PersianCalendar } from '../calendars/persian';
import { Calendars } from './calendar/calendars';
import { DateTime } from './date-time';

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
      console.log(gregorian2Date.year, gregorian2Date.month, gregorian2Date.day); //-> 2021, 10, 26
    });

    it('Convert datetime', () => {
      const d = new DateTime({ calendar: Calendars.find('persian') });

      const gregorianDate = new DateTime(); // now
      console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); //-> 2021, 10, 26

      const persianDate = new DateTime({ calendar: 'persian' }); //now
      console.log(persianDate.year, persianDate.month, persianDate.day); //-> 1400, 8, 4

      const hijriDate = new DateTime({ calendar: 'hijri' }); //now
      console.log(hijriDate.year, hijriDate.month, hijriDate.day); //-> 1443, 1, 19

      const gregorian2Date = new DateTime({ calendar: 'gregorian2' }); //now
      console.log(gregorian2Date.year, gregorian2Date.month, gregorian2Date.day); //-> 2021, 10, 26
    });

    it('Use Locale', () => {
      const d = new DateTime({ calendar: 'hijri', locale: Locales.resolve('ar-AE') })
      console.log(d.hour);
    });


    it('Use Zone', () => {
      const d = new DateTime({ calendar: 'hijri', locale: Locales.resolve('ar-AE') })
      console.log(d.hour);
    });
  });

});

