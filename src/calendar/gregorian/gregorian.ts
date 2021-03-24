import { DateTimeUnits } from 'src/date';
import { Calendar2 } from '..';

export class Gregorian extends Calendar2 {

  get id(): string {
    return 'gregorian';
  }

  get name(): string {
    return 'gregorian';
  }

  getUnits(ts: number): DateTimeUnits {
    const d = new Date(ts);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds(),
      ms: d.getUTCMilliseconds()
    };
  }

  getTimestamp(units: DateTimeUnits): number {
    const u = units;
    return Date.UTC(u.year, u.month, u.day, u.hour, u.month, u.second, u.ms);
  }

  weekDay(ts: number): number {
    return new Date(ts).getUTCDay() + 1;
  }

  dayOfYear(ts: number): number {
    throw new Error('Method not implemented.');
  }

  weekNumber(ts: number, weekStart: number, offset: number): number {
    throw new Error('Method not implemented.');
  }

  daysInMonth(ts: number): number {
    throw new Error('Method not implemented.');
  }

  daysInYear(ts: number): number {
    throw new Error('Method not implemented.');
  }

  isLeapYear(ts: number): boolean {
    throw new Error('Method not implemented.');
  }

  isValid(year: number, month: number, day: number): boolean {
    throw new Error('Method not implemented.');
  }

  add(ts: number, units: Partial<DateTimeUnits>): number {
    throw new Error('Method not implemented.');
  }

  subtract(ts: number, units: Partial<DateTimeUnits>): number {
    throw new Error('Method not implemented.');
  }
}
