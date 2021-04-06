import assert from 'assert';
import { Duration } from './duration';

describe('Duration', () => {
  it('can compute interval components correctly', () => {
    const d = new Duration(1000000);

    assert.strictEqual(d.ms, 0);
    assert.strictEqual(d.seconds, 0);
    assert.strictEqual(d.minutes, 1000);
    assert.strictEqual(d.hours, 1000);
    assert.strictEqual(d.days, 1000);

    assert.strictEqual(d.totalMs, 1000000);
    assert.strictEqual(d.totalSeconds, 1000);
    assert.strictEqual(d.totalMinutes, 16);
    assert.strictEqual(d.totalHours, 0);
    assert.strictEqual(d.totalDays, 1000);
  });
});
