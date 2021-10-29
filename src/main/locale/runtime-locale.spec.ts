import assert from 'assert';
import { Calendars } from '../calendar';
import { PersianCalendar } from '../../calendars/persian';
import { RuntimeLocale } from './runtime-locale';
import { GregorianCalendar } from '../../calendars/gregorian';


describe('Main/Locale', () => {
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

    it('can create fa-IR locale', () => {
      const l = new RuntimeLocale('system', { weekStart: 6 });
      assert.ok(l.resolvedName);
    });

    it('can get long month names of the gregorian calendar', () => {
      const l1 = new RuntimeLocale('fa', { weekStart: 6 });
      const calendar = Calendars.find('gregorian');
      const monthNames = l1.getMonthNames(calendar, 'long');
      assert.deepStrictEqual(monthNames,
        [
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
      const l1 = new RuntimeLocale('en', { weekStart: 6 });
      const c = Calendars.find('persian');
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
      const l1 = new RuntimeLocale('en', { weekStart: 6 });
      assert.deepStrictEqual(l1.getMonthNames(Calendars.find('gregorian'), 'short'), [
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
      const l1 = new RuntimeLocale('fa', { weekStart: 6 });
      assert.deepStrictEqual(l1.getMonthNames(Calendars.find('gregorian'), 'narrow'), [
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
      const l1 = new RuntimeLocale('fa', { weekStart: 6 });
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
      const l1 = new RuntimeLocale('fa', { weekStart: 6 });
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

    it('can get UTC zone name', () => {
      const l = new RuntimeLocale('fa', { weekStart: 6 });
      assert.strictEqual(l.getZoneTitle('UTC'), 'زمان هماهنگ جهانی');
    });

    // it('can get Local zone name', () => {
    //   const l = new RuntimeLocale('fa', { weekStart: 6 });
    //   assert.strictEqual(l.getIANAZoneTitle(Zones.local), 'وقت تابستانی ایران');
    // });

    it('can get [America/New_York] zone name', () => {
      const l = new RuntimeLocale('fa', { weekStart: 6 });
      assert.strictEqual(l.getZoneTitle('America/New_York'), 'وقت تابستانی شرق امریکا');
    });
  });
});
