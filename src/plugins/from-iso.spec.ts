import assert from 'assert';
import { Calendars, DateTime } from '../main';
import { fromJsDate } from './from-js-date';
import { fromIso } from './from-iso';
import { GregorianCalendar } from '../calendars/gregorian';

describe('Plugins', () => {
  describe('fromIso', () => {
    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
    });

    it('can create a DateTime object from an ISO 8601 date string', () => {
      const d1 = fromIso('2011-10-10T08:40:00.000Z');

      // const dt = new DateTime({
      //   zone: 'Asia/Tokyo',
      //   locale: 'ro',
      // });
      // const d = fromJsDate(new Date(), { zone: 'Asia/Tokyo', locale: 'ro' });
      // assert.strictEqual(dt.locale, d.locale);
      // assert.strictEqual(dt.zone, d.zone);
      // assert.strictEqual(dt.calendar, d.calendar);
    });
  });
});
