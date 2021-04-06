import assert from 'assert';
import { RuntimeLocale } from './runtime-locale';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../calendar/persian/persian';

Calendars.add(new PersianCalendar());

describe('Locale', () => {
  describe('Locales', function () {
    it('can get system locale', () => {

    });


  });
});
