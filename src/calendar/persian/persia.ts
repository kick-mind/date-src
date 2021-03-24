import { Calendar, DateTimeUnits, DayOfWeek } from '../calendar';
import { Helper } from './helper';
// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-const

const _ticksPerSecond = 1000;
const _ticksPerMinute = _ticksPerSecond * 60;
const _ticksPerHour = _ticksPerMinute * 60;
const _ticksPerDay = _ticksPerHour * 24;

const _persianEpoch: number = 19603728000000 / _ticksPerDay;
const _approximateHalfYear = 180;
const _monthsPerYear = 12;
const _maxCalendarYear = 9000;
const _DaysToMonth = [
  0,
  31,
  62,
  93,
  124,
  155,
  186,
  216,
  246,
  276,
  306,
  336,
  366,
];

function checkAddResult(ticks: number, minValue: Date, maxValue: Date) {
  if (ticks < minValue.getTime() || ticks > maxValue.getTime()) {
    throw new Error();
  }
}

function monthFromOrdinalDay(ordinalDay: number): number {
  let index = 0;
  while (ordinalDay > _DaysToMonth[index]) {
    index++;
  }

  return index;
}

function daysInPreviousMonths(month: number): number {
  --month;
  return _DaysToMonth[month];
}

function getAbsoluteDatePersian(
  year: number,
  month: number,
  day: number
): number {
  if (year >= 1 && year <= _maxCalendarYear && month >= 1 && month <= 12) {
    const ordinalDay = daysInPreviousMonths(month) + day - 1;
    const approximateDaysFromEpochForYearStart = Math.trunc(
      Helper._meanTropicalYearInDays * (year - 1)
    );
    let yearStart = Helper.PersianNewYearOnOrBefore(
      _persianEpoch +
        approximateDaysFromEpochForYearStart +
        _approximateHalfYear
    );
    yearStart += ordinalDay;
    return yearStart;
  }
  throw new Error();
}

function timeToTicks(
  hour: number,
  minute: number,
  second: number,
  ms: number
): number {
  if (
    hour >= 0 &&
    hour < 24 &&
    minute >= 0 &&
    minute < 60 &&
    second >= 0 &&
    second < 60 &&
    ms >= 0 &&
    ms < _ticksPerSecond
  ) {
    return (
      hour * _ticksPerHour +
      minute * _ticksPerMinute +
      second * _ticksPerSecond +
      ms
    );
  }
  throw new Error();
}
export class Persia extends Calendar {
  static MinDate: Date = new Date('622/3/22');
  static MaxDate: Date = new Date('9999/12/31');

  addMonths(time: number, months: number): number {
    if (months < -120000 || months > 120000) {
      throw new Error();
    }
    let ut = this.getUnits(time);
    let y = ut.year;
    let m = ut.month;
    let d = ut.day;
    const i = m - 1 + months;
    if (i >= 0) {
      m = (i % 12) + 1;
      y = Math.trunc(y + i / 12);
    } else {
      m = 12 + ((i + 1) % 12);
      y = Math.trunc(y + (i - 11) / 12);
    }
    const days = this.daysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      getAbsoluteDatePersian(y, m, d) * _ticksPerDay +
      (time % _ticksPerDay);
    checkAddResult(ticks, Persia.MinDate, Persia.MaxDate);
    return Helper.getJsTicks(ticks);
  }

  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }

  weekDay(time: number): DayOfWeek {
    const day = Math.trunc(Helper.getPersiaTicks(time) / _ticksPerDay + 1) % 7;
    return day as DayOfWeek;
  }

  dayOfYear(time: number): number {
    let NumDays = Math.trunc(Helper.getPersiaTicks(time) / _ticksPerDay) + 1;

    const yearStart = Helper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - _persianEpoch) / Helper._meanTropicalYearInDays + 0.5
        )
      ) + 1;

    const ordinalDay = Math.trunc(
      NumDays -
        Helper.getNumberOfDays(
          this.getTimestamp({
            year: y,
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0,
          })
        )
    );

    return ordinalDay;
  }

  daysInMonth(year: number, month: number): number {
    let daysInMonth = _DaysToMonth[month] - _DaysToMonth[month - 1];
    if (month == _monthsPerYear && !this.isInLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }

  daysInYear(year: number): number {
    return this.isInLeapYear(year) ? 366 : 365;
  }

  isInLeapYear(year: number): boolean {
    return (
      getAbsoluteDatePersian(year + 1, 1, 1) -
        getAbsoluteDatePersian(year, 1, 1) ==
      366
    );
  }

  isValid(year: number, month: number, day: number): boolean {
    return (
      year >= 1 &&
      year <= _maxCalendarYear &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= this.daysInMonth(year, month)
    );
  }

  getTimestamp(units: DateTimeUnits): number {
    const daysInMonth = this.daysInMonth(units.year, units.month);
    if (units.day < 1 || units.day > daysInMonth) {
      throw new Error();
    }

    const lDate = getAbsoluteDatePersian(
      units.year,
      units.month,
      units.day
    );

    if (lDate >= 0) {
      let ticks =
        lDate * _ticksPerDay +
        timeToTicks(units.hour, units.minute, units.second, units.ms);
      return Helper.getJsTicks(ticks);
    } else {
      throw new Error();
    }
  }

  getUnits(ts: number): DateTimeUnits {
    ts = Helper.getPersiaTicks(ts);
    let tu = this.getDateUnits(ts);
    tu.hour = this.hour(ts);
    tu.minute = this.minute(ts);
    tu.second = this.second(ts);
    tu.ms = this.ms(ts);
    return tu;
  }

  private getDateUnits(ticks: number): DateTimeUnits {
    let du: DateTimeUnits = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
    };

    let NumDays;
    NumDays = Math.trunc(ticks / _ticksPerDay) + 1;
    const yearStart = Helper.PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.trunc(
        Math.floor(
          (yearStart - _persianEpoch) / Helper._meanTropicalYearInDays + 0.5
        )
      ) + 1;

    const ordinalDay = Math.trunc(
      NumDays -
        Helper.getNumberOfDays(
          this.getTimestamp({
            ['year']: y,
            month: 1,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0,
          })
        )
    );

    du.year = y;
    du.month = monthFromOrdinalDay(ordinalDay);
    du.day = ordinalDay - daysInPreviousMonths(du.month);

    return du;
  }
}
