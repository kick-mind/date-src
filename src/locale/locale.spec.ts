import { JsLocale, Locales } from '.';
import { Calendars } from '../calendar';

describe('Locale', () => {
  it('can get long month names (JsLocale)', () => {
    const l1 = new JsLocale('fa', { weekStart: 6 });

    expect(l1.getMonthNames(Calendars.findById('gregorian'), 'long')).toEqual([
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

  it('can get short month names (JsLocale)', () => {
    const l1 = new JsLocale('fa', { weekStart: 6 });

    expect(l1.getMonthNames(Calendars.findById('gregorian'), 'short')).toEqual([
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

  it('can get narrow month names (JsLocale)', () => {
    const l1 = new JsLocale('fa', { weekStart: 6 });

    expect(l1.getMonthNames(Calendars.findById('gregorian'), 'narrow')).toEqual([
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

});

