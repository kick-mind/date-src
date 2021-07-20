import assert from 'assert';
import { weekDayLocale } from './week-day-locale';
import { DateTime } from '../main';

describe('Plugins', () => {
  describe('toJsDate', () => {
    it('toJsDate', () => {
      const dt = weekDayLocale(new DateTime({locale: 'fa', calendar: 'persian'}));
   
    });
  });
});
