import { Locales } from '../locale';
import { Zones } from '../zone';
import { DateTime } from './date-time';

describe('DateTime', () => {
  it('create without parameter', () => {
    const d = new DateTime();
    const jd = new Date();
    expect(d.year).toBe(jd.getFullYear());
    expect(d.month).toBe(jd.getMonth());
    expect(d.day).toBe(jd.getDate());
    expect(d.minute).toBe(jd.getMinutes());
    expect(d.second).toBe(jd.getSeconds());
  });

  it('create from timestamp', () => {
    const d1 = new DateTime(12345);
    expect(d1.year).toBe(1000);
    expect(d1.month).toBe(1);
    expect(d1.day).toBe(1);
    // Do more validation on d1 here...


    const d2 = new DateTime(12345, { calendar: 'persian' });
    expect(d2.year).toBe(1000);
    expect(d2.month).toBe(1);
    expect(d2.day).toBe(1);
    // Do more validation on d2 here...

  });

  it('can format dates', () => {
    const l = Locales.find('fa-IR');
    const z = Zones.utc;
    const d = new DateTime(2001, 9, 8, 18, 5, 4, 90, { locale: l, zone: z });
    expect(d.format('Y YY YYYY')).toBe('2001 01 2001');
    expect(d.format('M MM MMM MMMM')).toBe('9 09 نوامبر نوامبر');
    expect(d.format('d dd')).toBe('8 08');
    expect(d.format('H HH h hh')).toBe('18 18 6 06');
    expect(d.format('m mm')).toBe('5 05');
    expect(d.format('s ss')).toBe('4 04');
    expect(d.format('f fff')).toBe('90 090');
    expect(d.format('c cc C CC CCC')).toBe('');
    expect(d.format('z zz zzz Z ZZ ZZZ')).toBe('0 00:00 0000 UTC utc utc');
    expect(d.format('[Now:] YYYY/MM/dd HH:mm:ss')).toBe('Now: 2001/09/08 18:05:04');
    expect(d.format('[This Text and [this text] should be skipped] [and the date is:] YYYY/MM/dd'))
      .toBe('This Text and [this text] should be skipped and the date is: 2001/09/08');
  });
});
