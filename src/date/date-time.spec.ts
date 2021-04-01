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
    const d = new DateTime(2000, 1, 1, 12, 15, 45, 500);
    let f = d.format('Y');
    f = d.format('YY');
    f = d.format('YYYY');
    f = d.format('M');
    f = d.format('MM');
    f = d.format('MMM');
    f = d.format('MMMM');
    f = d.format('d');
    f = d.format('dd');
    f = d.format('H');
    f = d.format('HH');
    f = d.format('h');
    f = d.format('hh');
    f = d.format('m');
    f = d.format('mm');
    f = d.format('s');
    f = d.format('ss');
    f = d.format('S');
    f = d.format('SSS');
    f = d.format('c')
    f = d.format('cc');
    f = d.format('ccc');
    f = d.format('cccc');
    f = d.format('ccccc');
    f = d.format('z');
    f = d.format('Z');
    f = d.format('ZZ');
    f = d.format('ZZZZ');
    f = d.format('ZZZZZ');
  });
});
