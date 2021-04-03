import assert from 'assert';
import { JsLocale, Locales } from '.';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../calendar/persian/persian';

Calendars.add(new PersianCalendar());

describe('Locale', () => {
  describe('Locales', function () {
    it('can get system locale', () => {
      let d = Locales.system;

    });


  });
});
