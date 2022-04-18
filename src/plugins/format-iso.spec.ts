import assert from 'assert';
import { Calendars, DateTime, Locales, Zones } from '../main';
import { formatIso } from './format-iso';
import { GregorianCalendar } from '../calendars/gregorian';
import { GregorianCalendar2 } from '../calendars/gregorian2';
import { PersianCalendar } from '../calendars/persian';

describe('Plugins', () => {
  describe('formatIso', () => {

    before(function () {
      Calendars.add(new GregorianCalendar('gregorian'));
      Calendars.add(new GregorianCalendar2('gregorian2'));
      Calendars.add(new PersianCalendar('persian'));
    });

    it('can format dates to ISO 8601', () => {
      const d1 = new DateTime(2001, 9, 8, 18, 5, 4, 90, { calendar: 'gregorian', locale: 'fa-IR', zone: Zones.utc });
      assert.strictEqual(formatIso(d1), '2001-09-08T18:05:04.090+00:00');

      const d2 = new DateTime(1344, 1, 1, 0, 0, 0, 0, { calendar: 'persian', locale: 'fa-IR', zone: Zones.utc });
      assert.strictEqual(formatIso(d2), '1965-03-21T00:00:00.000+00:00');
    });
  });
});
