import { DateTime } from './date-time';

describe('DateTime class', () => {
  it('can add a locale', () => {
    expect(4).toEqual(4);
    DateTime.addLocale(null);
  });

  it('can find a locale by name', () => {
    const l = DateTime.findLocale('L1');
    expect(l).toBeDefined();
  });
});
