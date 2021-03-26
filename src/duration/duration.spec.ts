import { Duration } from './duration';

describe('Duration', () => {
  it('can compute interval components correctly', () => {
    const d = new Duration(1000000);

    expect(d.ms).toBe(0);
    expect(d.seconds).toBe(0);
    expect(d.minutes).toBe(1000);
    expect(d.hours).toBe(1000);
    expect(d.days).toBe(1000);

    expect(d.totalMs).toBe(1000000);
    expect(d.totalSeconds).toBe(1000);
    expect(d.totalMinutes).toBe(16);
    expect(d.totalHours).toBe(0);
    expect(d.totalDays).toBe(1000);
  });
});
