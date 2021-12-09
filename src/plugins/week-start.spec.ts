import assert from 'assert';
import { DateTime, Calendars } from '../main';
import { PersianCalendar } from '../calendars/persian';

describe('Plugins', () => {
  describe('weekstart', () => {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
    });
    it('week-start', () => {
      const dt = new DateTime();
      console.log(dt.year + '/' + dt.month + '/' + dt.day);
      console.log('weekStart: ' + dt.locale.weekStart);
    });
  });
});
