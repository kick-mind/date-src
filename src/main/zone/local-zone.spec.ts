import assert from 'assert';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../../calendars/persian';
import { GregorianCalendar } from '../../calendars/gregorian';
import { LocalZone, RuntimeIANAZone } from '.';


describe('Main', () => {
  describe('LocalZone', function () {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new GregorianCalendar('gregorian'));
    });


    it('can create local zone', () => {
      const z1 = new LocalZone();
      assert.strictEqual(z1.getCurrentOffset(), 3 * 60 + 30);
    });
    
  });
});
