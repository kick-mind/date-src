import assert from 'assert';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../../calendars/persian';
import { RuntimeLocale } from './runtime-locale';
import { GregorianCalendar } from '../../calendars/gregorian';


describe('Main', () => {
  describe('RuntimeLocale', function () {
    before(function () {
      Calendars.add(new PersianCalendar('persian'));
      Calendars.add(new GregorianCalendar('gregorian'));
    });


    it('can create system locale', () => {
      const l = new RuntimeLocale('system', { weekStart: 6 });
      assert.strictEqual(l.name, 'system');
      assert.ok(l.resolvedName);
      assert.strictEqual(l.getMonthNames(Calendars.find('persian')).length, 12);
      assert.strictEqual(l.getWeekdayNames().length, 7);
      assert.strictEqual(l.weekStart, 6);
      // assert.ok(l.getIANAZoneTitle(Zones.utc));
    });


    it('can create en-USA locale', () => {
      const l = new RuntimeLocale('en', { weekStart: 6 });
      const gregorianCalendar = Calendars.find('gregorian');
      const persianCalendar = Calendars.find('persian');

      assert.strictEqual(l.name, 'en');
      assert.ok(l.resolvedName);
      assert.deepStrictEqual(
        l.getMonthNames(gregorianCalendar),
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      );
      assert.deepStrictEqual(
        l.getMonthNames(persianCalendar),
        ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand']
      );
      assert.deepStrictEqual(
        l.getWeekdayNames(),
        ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      );

      assert.strictEqual(l.weekStart, 6);
      assert.strictEqual(l.getZoneTitle('UTC'), 'Coordinated Universal Time');
      assert.strictEqual(l.getZoneTitle('Asia/Tehran'), 'Iran Standard Time');
    });

    it('can create fa locale', () => {
      const l = new RuntimeLocale('fa', { weekStart: 6 });
      const gregorianCalendar = Calendars.find('gregorian');
      const persianCalendar = Calendars.find('persian');
      const gregorianMonthNames = l.getMonthNames(gregorianCalendar, 'long');
      const persianMonthNames = l.getMonthNames(persianCalendar, 'long');

      assert.ok(l.resolvedName);
      assert.deepStrictEqual(gregorianMonthNames, [
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

      assert.deepStrictEqual(persianMonthNames, [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند'
      ]);

      assert.deepStrictEqual(l.getWeekdayNames(), [
        'شنبه',
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنجشنبه',
        'جمعه',
      ]);

      assert.deepStrictEqual(l.getWeekdayNames('long', 0), [
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنجشنبه',
        'جمعه',
        'شنبه',
      ]);

      assert.deepStrictEqual(l.getWeekdayNames('long', 3), [
        'چهارشنبه',
        'پنجشنبه',
        'جمعه',
        'شنبه',
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
      ]);

      assert.deepStrictEqual(l.getWeekdayNames('narrow'), [
        'ش',
        'ی',
        'د',
        'س',
        'چ',
        'پ',
        'ج',
      ]);

      assert.deepStrictEqual(l.getMonthNames(Calendars.find('gregorian'), 'narrow'), [
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



      assert.strictEqual(l.getZoneTitle('UTC'), 'زمان هماهنگ جهانی');

      const t = l.getZoneTitle('America/New_York');
      if (t !== 'وقت عادی شرق امریکا' && t !== 'وقت تابستانی شرق امریکا') {
        assert.fail()
      }
    });


    it('can format numbers', () => {
      const l = new RuntimeLocale('fa', { weekStart: 6 });
      assert.strictEqual(l.formatNumber(123456), '۱۲۳۴۵۶');
      assert.strictEqual(l.formatNumber(1, { minimumIntegerDigits: 3 }), '۰۰۱');
      assert.strictEqual(l.formatNumber(123456, { minimumIntegerDigits: 3 }), '۱۲۳۴۵۶');
    });
  });
});
