import { DateTime } from './date-time';

describe('DateTime', () => {
  it('can be created from timestamp', () => {
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

  it('can be created from string', () => {
  });

  it('can be created from date-time units', () => {
  });
});
