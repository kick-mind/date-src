import assert from 'assert';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../../calendars/persian';
import { GregorianCalendar } from '../../calendars/gregorian';
import { LocalZone, RuntimeIANAZone } from '.';
import { DateTime } from '../date-time';


describe('Main', () => {
  describe('LocalZone', function () {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new GregorianCalendar('gregorian'));
    });


    it('can create local zone', () => {
      const z1 = new LocalZone();
      assert.strictEqual(z1.getCurrentOffset(), 270);
    });

    it('can create local zone2', () => {
      var date = new DateTime();
      const z1 = new LocalZone();
      console.log(z1.getOffset(date.ts));
      assert.strictEqual(z1.getOffset(date.ts), 270);
    });
    
  });
});
