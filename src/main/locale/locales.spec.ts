import assert from 'assert';
import { RuntimeLocale } from './runtime-locale';
import { Calendars } from '../calendar';
// import { PersianCalendar } from '../calendar/persian/persian';
import { Locales } from './locales';

// Calendars.add(new PersianCalendar('persian'));

describe('Main', () => {
  describe('Locales', function () {

    it('can get system locale', () => {
      assert.ok(Locales.system);
    });

    it('can get default locale', () => {
      assert.ok(Locales.default);
    });

    it('can resolve "fa" locale', () => {
      assert.ok(Locales.resolve('fa'));
    });

    
  });
});
