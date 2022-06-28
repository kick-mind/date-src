import assert from 'assert';
import { GregorianCalendar } from '../calendars/gregorian';
import { PersianCalendar } from '../calendars/persian';
import { DateTimeUnits } from '../main/common';;
import { Calendars, DateTime, DateTimeCreationOptions, Zones } from '../main';
import { fromObject } from './from-object';

describe('Plugins', () => {
  describe('fromObject', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('can creates a DateTime object from javascript Date', () => {
      const units: DateTimeUnits = {
        year: 2020,
        month: 1,
        day: 2,
        hour: 12,
        minute: 13,
        second: 14,
        ms: 15,
      };

      const options: DateTimeCreationOptions = {
        zone: Zones.utc,
        locale: 'en',
        calendar: 'persian'
      }

      const d1 = new DateTime(units.year, units.month, units.day, units.hour, units.minute, units.second, units.ms, options);
      const d2 = fromObject(units, options);

      assert.deepStrictEqual(d1.toObject(), d2.toObject());
      // assert.strictEqual(d1.locale, d2.locale);
      // assert.strictEqual(d1.locale, d2.locale);
      // assert.strictEqual(d1.locale, d2.locale);
      // assert.strictEqual(d1.locale, d2.locale);
      // assert.strictEqual(d1.zone, d2.zone);
      // assert.strictEqual(d1.calendar, d2.calendar);
    });
  });
});
