import assert from 'assert';
import { Duration } from './duration';
import moment from 'moment';

describe('Duration', () => {
  it('compare with moment', () => {
    const random = Math.floor(Math.random() * 1000000);
    const m = moment.duration(random);
    const d = new Duration(random);
    assert.strictEqual(d.days, m.days());
    assert.strictEqual(d.minutes, m.minutes());
    assert.strictEqual(d.ms, m.milliseconds());
    assert.strictEqual(d.hours, m.hours());
  });

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
