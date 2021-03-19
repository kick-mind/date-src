import { PersianDate } from './persian';

describe('PersianDate class', () => {
  it('can be created via constructor', () => {
    const pd = new PersianDate(null);
    pd.toObject.day = 23;
    expect(pd).toBeDefined();
  });

  it('can parse a string', () => {
  });

  it('can format a string', () => {
  });

  it('can add dates', () => {
  });

  it('can subtract dates', () => {
  });
});
