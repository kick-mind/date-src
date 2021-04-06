import assert from 'assert';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../calendar/persian/persian';
import { RuntimeLocale } from './runtime-locale';

Calendars.add(new PersianCalendar('persian'));

describe('Locale', () => {
  describe('RuntimeLocale', function () {
    it('can get long month names of the gregorian calendar', () => {
      const l1 = new RuntimeLocale('fa-IR.r', 'fa', { weekStart: 6 });
      assert.deepStrictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'long'), [
        'ژانویه',
        'فوریه',
        'مارس',
        'آوریل',
        'مه',
        'ژوئن',
        'ژوئیه',
        'اوت',
        'سپتامبر',
        'اکتبر',
        'نوامبر',
        'دسامبر',
      ]);
    });

    it('can get long month names of the persian calendar (en locale)', () => {
      const l1 = new RuntimeLocale('fa-IR.r', 'en', { weekStart: 6 });
      const c = Calendars.findById('persian');
      const months = l1.getMonthNames(c, 'long');
      assert.deepStrictEqual(months, [
        'Farvardin',
        'Ordibehesht',
        'Khordad',
        'Tir',
        'Mordad',
        'Shahrivar',
        'Mehr',
        'Aban',
        'Azar',
        'Dey',
        'Bahman',
        'Esfand',
      ]);
    });

    it('can get short month names (en locale)', () => {
      const l1 = new RuntimeLocale('en.r', 'en', { weekStart: 6 });
      assert.deepStrictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'short'), [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]);
    });

    it('can get narrow month names', () => {
      const l1 = new RuntimeLocale('fa-IR.r', 'fa', { weekStart: 6 });
      assert.deepStrictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'narrow'), [
        'ژ',
        'ف',
        'م',
        'آ',
        'م',
        'ژ',
        'ژ',
        'ا',
        'س',
        'ا',
        'ن',
        'د',
      ]);
    });

    it('can get long weekday names', () => {
      const l1 = new RuntimeLocale('fa-IR.r', 'fa', { weekStart: 6 });
      assert.deepStrictEqual(l1.getWeekdayNames(), [
        'شنبه',
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنجشنبه',
        'جمعه',
      ]);
    });

    it('can get narrow weekday names', () => {
      const l1 = new RuntimeLocale('fa-IR.r', 'fa', { weekStart: 6 });
      assert.deepStrictEqual(l1.getWeekdayNames('narrow'), [
        'ش',
        'ی',
        'د',
        'س',
        'چ',
        'پ',
        'ج',
      ]);
    });
  });
});
