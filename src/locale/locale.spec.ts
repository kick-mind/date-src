import assert from 'assert';
import { JsLocale, Locales } from '.';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../calendar/persian/persian';

Calendars.add(new PersianCalendar());

describe('Locale', () => {
  describe('JsLocale', function () {
    it('can get long month names of the gregorian calendar', () => {
      const l1 = new JsLocale('fa', { weekStart: 6 });
      assert.strictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'long'), [
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

    it('can get long month names of the persian calendar', () => {
      const l1 = new JsLocale('en', { weekStart: 6 });
      assert.strictEqual(l1.getMonthNames(Calendars.findById('persian'), 'long'), [
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

    it('can get short month names', () => {
      const l1 = new JsLocale('en', { weekStart: 6 });
      assert.strictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'short'), [
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
      const l1 = new JsLocale('fa', { weekStart: 6 });
      assert.strictEqual(l1.getMonthNames(Calendars.findById('gregorian'), 'narrow'), [
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
      const l1 = new JsLocale('fa', { weekStart: 6 });
      assert.strictEqual(l1.getWeekdayNames(), [
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
      const l1 = new JsLocale('fa', { weekStart: 6 });
      assert.strictEqual(l1.getWeekdayNames('narrow'), [
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
