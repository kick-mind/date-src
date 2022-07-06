/**
 * @category Calendar
 * @module PersianCalendar
 */

import {
  CalendarBase,
  DateTimeUnits,
  getCalendarTimestamp,
  getJsTimestamp,
  MAX_YEAR,
  MS_PER_DAY,
  throwInvalidParam,
  timeToTicks,
  getTimeUnits
} from '../main';
class AlgoMap {
  constructor(year: number, algorithm: number) {
    this._lowestYear = year;
    this._algorithm = algorithm;
  }
  _lowestYear: number;
  _algorithm: number;
}

const FULL_CIRCLE_OF_ARC = 360.0; // 360.0;
const HALF_CIRCLE_OF_ARC = 180;
const TWELVE_HOURS = 0.5; // half a day
const NOON2000_JAN01 = 730120.5;
const LONGITUDE_SPRING = 0.0;
const TWO_DEGREES_AFTER_SPRING = 2.0;
const SECONDS_PER_DAY: number = 24 * 60 * 60;
const DAYS_IN_UNIFORM_LENGTH_CENTURY = 36525;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_DEGREE = 60;
const START_OF_1810 = 660723;
const START_OF_1900_CENTURY = 693595;
const COEFF_1900_TO_1987: number[] = [
  -0.00002,
  0.000297,
  0.025184,
  -0.181133,
  0.55304,
  -0.861938,
  0.677066,
  -0.212591,
];
const COEFF_1800_TO_1899: number[] = [
  -0.000009,
  0.003844,
  0.083563,
  0.865736,
  4.867575,
  15.845535,
  31.332267,
  38.291999,
  28.316289,
  11.636204,
  2.043794,
];
const COEFF_1700_TO_1799: number[] = [
  8.118780842,
  -0.005092142,
  0.003336121,
  -0.0000266484,
];
const COEFF_1620_TO_1699: number[] = [196.58333, -4.0675, 0.0219167];
const LAMBDA_COEFFICIENTS: number[] = [280.46645, 36000.76983, 0.0003032];
const ANOMALY_COEFFICIENTS: number[] = [
  357.5291,
  35999.0503,
  -0.0001559,
  -0.00000048,
];
const ECCENTRICITY_COEFFICIENTS: number[] = [
  0.016708617,
  -0.000042037,
  -0.0000001236,
];
const COEFF_A: number[] = [124.9, -1934.134, 0.002063];
const COEFF_B: number[] = [201.11, 72001.5377, 0.00057];
const MEAN_TROPICAL_YEAR_IN_DAYS = 365.242189;
const MEAN_SPEED_OF_SUN: number =
  MEAN_TROPICAL_YEAR_IN_DAYS / FULL_CIRCLE_OF_ARC;

const COEFF: number[] = [
  angle(23, 26, 21.448),
  angle(0, 0, -46.815),
  angle(0, 0, -0.00059),
  angle(0, 0, 0.001813),
];
const CORRECTION_TABLE: AlgoMap[] = [
  new AlgoMap(2020, 0),
  new AlgoMap(1988, 1),
  new AlgoMap(1900, 2),
  new AlgoMap(1800, 3),
  new AlgoMap(1700, 4),
  new AlgoMap(1620, 5),
  new AlgoMap(Number.MIN_VALUE, 0),
];

function radiansFromDegrees(degree: number): number {
  return (degree * Math.PI) / 180;
}

function sinOfDegree(degree: number): number {
  return Math.sin(radiansFromDegrees(degree));
}

function cosOfDegree(degree: number): number {
  return Math.cos(radiansFromDegrees(degree));
}
function tanOfDegree(degree: number): number {
  return Math.tan(radiansFromDegrees(degree));
}

function angle(degrees: number, minutes: number, seconds: number): number {
  return (
    (seconds / SECONDS_PER_MINUTE + minutes) / MINUTES_PER_DEGREE + degrees
  );
}

function obliquity(julianCenturies: number): number {
  return polynomialSum(COEFF, julianCenturies);
}

function getGregorianYear(numberOfDays: number): number {
  const date = new Date(getDaysTicks(numberOfDays));
  return date.getFullYear();
}

function reminder(divisor: number, dividend: number): number {
  const whole = Math.floor(divisor / dividend);
  return divisor - dividend * whole;
}

function normalizeLongitude(longitude: number): number {
  longitude = reminder(longitude, FULL_CIRCLE_OF_ARC);
  if (longitude < 0) {
    longitude += FULL_CIRCLE_OF_ARC;
  }
  return longitude;
}

function asDayFraction(longitude: number): number {
  return longitude / FULL_CIRCLE_OF_ARC;
}

function polynomialSum(coeff: number[], indeterminate: number): number {
  let sum = coeff[0];
  let indeterminateRaised = 1;
  for (let i = 1; i < coeff.length; i++) {
    indeterminateRaised *= indeterminate;
    sum += coeff[i] * indeterminateRaised;
  }
  return sum;
}

function centuriesFrom1900(gregorianYear: number): number {
  const july1stOfYear = getNumberOfDays(
    new Date(`${gregorianYear}/7/1`).getTime()
  );
  return (
    (july1stOfYear - START_OF_1900_CENTURY) / DAYS_IN_UNIFORM_LENGTH_CENTURY
  );
}

function defaultCorr(gregorianYear: number): number {
  const january1stOfYear = Math.trunc(
    getNumberOfDays(new Date(`${gregorianYear}/1/1`).getTime())
  );
  const daysSinceStartOf1810 = january1stOfYear - START_OF_1810;
  const x = TWELVE_HOURS + daysSinceStartOf1810;
  return (Math.pow(x, 2) / 41048480 - 15) / SECONDS_PER_DAY;
}

function ephemerisCorrection1988to2019(gregorianYear: number): number {
  return (gregorianYear - 1933) / SECONDS_PER_DAY;
}

function ephemerisCorrection1900to1987(gregorianYear: number): number {
  const from1900 = centuriesFrom1900(gregorianYear);
  return polynomialSum(COEFF_1900_TO_1987, from1900);
}

function ephemerisCorrection1800to1899(gregorianYear: number): number {
  const from1900 = centuriesFrom1900(gregorianYear);
  return polynomialSum(COEFF_1800_TO_1899, from1900);
}

function ephemerisCorrection1700to1799(gregorianYear: number): number {
  const yearsSince1700 = gregorianYear - 1700;
  return polynomialSum(COEFF_1700_TO_1799, yearsSince1700) / SECONDS_PER_DAY;
}

function ephemerisCorrection1620to1699(gregorianYear: number): number {
  const yearsSince1600 = gregorianYear - 1600;
  return polynomialSum(COEFF_1620_TO_1699, yearsSince1600) / SECONDS_PER_DAY;
}

function ephemerisCorrection(time: number): number {
  const year = getGregorianYear(time);
  CORRECTION_TABLE.forEach((map) => {
    if (map._lowestYear <= year) {
      switch (map._algorithm) {
        case 0:
          return defaultCorr(year);
        case 1:
          return ephemerisCorrection1988to2019(year);
        case 2:
          return ephemerisCorrection1900to1987(year);
        case 3:
          return ephemerisCorrection1800to1899(year);
        case 4:
          return ephemerisCorrection1700to1799(year);
        case 5:
          return ephemerisCorrection1620to1699(year);
      }
    }
  });
  return defaultCorr(year);
}

function calJulianCenturies(moment: number): number {
  const dynamicalMoment = moment + ephemerisCorrection(moment);
  return (dynamicalMoment - NOON2000_JAN01) / DAYS_IN_UNIFORM_LENGTH_CENTURY;
}

function isNegative(value: number): boolean {
  return Math.sign(value) == -1;
}

function copySign(value: number, sign: number): number {
  return isNegative(value) == isNegative(sign) ? value : -value;
}

function equationOfTime(time: number): number {
  const jc = calJulianCenturies(time);
  const lambda = polynomialSum(LAMBDA_COEFFICIENTS, jc);
  const anomaly = polynomialSum(ANOMALY_COEFFICIENTS, jc);
  const eccentricity = polynomialSum(ECCENTRICITY_COEFFICIENTS, jc);
  const epsilon = obliquity(jc);
  const tanHalfEpsilon = tanOfDegree(epsilon / 2);
  const y = tanHalfEpsilon * tanHalfEpsilon;
  const dividend =
    y * sinOfDegree(2 * lambda) -
    2 * eccentricity * sinOfDegree(anomaly) +
    4 * eccentricity * y * sinOfDegree(anomaly) * cosOfDegree(2 * lambda) -
    0.5 * Math.pow(y, 2) * sinOfDegree(4 * lambda) -
    1.25 * Math.pow(eccentricity, 2) * sinOfDegree(2 * anomaly);
  const divisor = 2 * Math.PI;
  const equation = dividend / divisor;
  return copySign(Math.min(Math.abs(equation), TWELVE_HOURS), equation);
}

function asLocalTime(apparentMidday: number, longitude: number): number {
  const universalTime = apparentMidday - asDayFraction(longitude);
  return apparentMidday - equationOfTime(universalTime);
}
// midday
function midday(date: number, longitude: number): number {
  return asLocalTime(date + TWELVE_HOURS, longitude) - asDayFraction(longitude);
}

function initLongitude(longitude: number): number {
  return (
    normalizeLongitude(longitude + HALF_CIRCLE_OF_ARC) - HALF_CIRCLE_OF_ARC
  );
}

function middayAtPersianObservationSite(date: number): number {
  return midday(date, initLongitude(52.5));
}

function periodicTerm(
  julianCenturies: number,
  x: number,
  y: number,
  z: number
): number {
  return x * sinOfDegree(y + z * julianCenturies);
}

function sumLongSequenceOfperiodicTerms(julianCenturies: number): number {
  // sum
  let sum = 0.0;
  sum += periodicTerm(julianCenturies, 403406, 270.54861, 0.9287892);
  sum += periodicTerm(julianCenturies, 195207, 340.19128, 35999.1376958);
  sum += periodicTerm(julianCenturies, 119433, 63.91854, 35999.4089666);
  sum += periodicTerm(julianCenturies, 112392, 331.2622, 35998.7287385);
  sum += periodicTerm(julianCenturies, 3891, 317.843, 71998.20261);
  sum += periodicTerm(julianCenturies, 2819, 86.631, 71998.4403);
  sum += periodicTerm(julianCenturies, 1721, 240.052, 36000.35726);
  sum += periodicTerm(julianCenturies, 660, 310.26, 71997.4812);
  sum += periodicTerm(julianCenturies, 350, 247.23, 32964.4678);
  sum += periodicTerm(julianCenturies, 334, 260.87, -19.441);
  sum += periodicTerm(julianCenturies, 314, 297.82, 445267.1117);
  sum += periodicTerm(julianCenturies, 268, 343.14, 45036.884);
  sum += periodicTerm(julianCenturies, 242, 166.79, 3.1008);
  sum += periodicTerm(julianCenturies, 234, 81.53, 22518.4434);
  sum += periodicTerm(julianCenturies, 158, 3.5, -19.9739);
  sum += periodicTerm(julianCenturies, 132, 132.75, 65928.9345);
  sum += periodicTerm(julianCenturies, 129, 182.95, 9038.0293);
  sum += periodicTerm(julianCenturies, 114, 162.03, 3034.7684);
  sum += periodicTerm(julianCenturies, 99, 29.8, 33718.148);
  sum += periodicTerm(julianCenturies, 93, 266.4, 3034.448);
  sum += periodicTerm(julianCenturies, 86, 249.2, -2280.773);
  sum += periodicTerm(julianCenturies, 78, 157.6, 29929.992);
  sum += periodicTerm(julianCenturies, 72, 257.8, 31556.493);
  sum += periodicTerm(julianCenturies, 68, 185.1, 149.588);
  sum += periodicTerm(julianCenturies, 64, 69.9, 9037.75);
  sum += periodicTerm(julianCenturies, 46, 8.0, 107997.405);
  sum += periodicTerm(julianCenturies, 38, 197.1, -4444.176);
  sum += periodicTerm(julianCenturies, 37, 250.4, 151.771);
  sum += periodicTerm(julianCenturies, 32, 65.3, 67555.316);
  sum += periodicTerm(julianCenturies, 29, 162.7, 31556.08);
  sum += periodicTerm(julianCenturies, 28, 341.5, -4561.54);
  sum += periodicTerm(julianCenturies, 27, 291.6, 107996.706);
  sum += periodicTerm(julianCenturies, 27, 98.5, 1221.655);
  sum += periodicTerm(julianCenturies, 25, 146.7, 62894.167);
  sum += periodicTerm(julianCenturies, 24, 110.0, 31437.369);
  sum += periodicTerm(julianCenturies, 21, 5.2, 14578.298);
  sum += periodicTerm(julianCenturies, 21, 342.6, -31931.757);
  sum += periodicTerm(julianCenturies, 20, 230.9, 34777.243);
  sum += periodicTerm(julianCenturies, 18, 256.1, 1221.999);
  sum += periodicTerm(julianCenturies, 17, 45.3, 62894.511);
  sum += periodicTerm(julianCenturies, 14, 242.9, -4442.039);
  sum += periodicTerm(julianCenturies, 13, 115.2, 107997.909);
  sum += periodicTerm(julianCenturies, 13, 151.8, 119.066);
  sum += periodicTerm(julianCenturies, 13, 285.3, 16859.071);
  sum += periodicTerm(julianCenturies, 12, 53.3, -4.578);
  sum += periodicTerm(julianCenturies, 10, 126.6, 26895.292);
  sum += periodicTerm(julianCenturies, 10, 205.7, -39.127);
  sum += periodicTerm(julianCenturies, 10, 85.9, 12297.536);
  sum += periodicTerm(julianCenturies, 10, 146.1, 90073.778);
  return sum;
}

function aberration(julianCenturies: number): number {
  return (
    0.0000974 * cosOfDegree(177.63 + 35999.01848 * julianCenturies) - 0.005575
  );
}

function nutation(julianCenturies: number): number {
  const a = polynomialSum(COEFF_A, julianCenturies);
  const b = polynomialSum(COEFF_B, julianCenturies);
  return -0.004778 * sinOfDegree(a) - 0.0003667 * sinOfDegree(b);
}

function compute(time: number): number {
  const jc = calJulianCenturies(time);
  const lambda =
    282.7771834 +
    36000.76953744 * jc +
    0.000005729577951308232 * sumLongSequenceOfperiodicTerms(jc);

  const longitude = lambda + aberration(jc) + nutation(jc);
  return initLongitude(longitude);
}

function asSeason(longitude: number): number {
  return longitude < 0 ? longitude + FULL_CIRCLE_OF_ARC : longitude;
}

function estimatePrior(longitude: number, time: number): number {
  const timeSunLastAtLongitude =
    time -
    MEAN_SPEED_OF_SUN * asSeason(initLongitude(compute(time) - longitude));
  const longitudeErrorDelta = initLongitude(
    compute(timeSunLastAtLongitude) - longitude
  );
  return Math.min(
    time,
    timeSunLastAtLongitude - MEAN_SPEED_OF_SUN * longitudeErrorDelta
  );
}

function getNumberOfDays(jsdate: number): number {
  return Math.trunc(
    getCalendarTimestamp(jsdate) / (SECONDS_PER_DAY * MILLISECONDS_PER_SECOND)
  );
}

function PersianNewYearOnOrBefore(numberOfDays: number): number {
  const date = numberOfDays;
  const approx = estimatePrior(
    LONGITUDE_SPRING,
    middayAtPersianObservationSite(date)
  );
  const lowerBoundNewYearDay = Math.trunc(Math.floor(approx)) - 1;
  const upperBoundNewYearDay = lowerBoundNewYearDay + 3;
  let day = lowerBoundNewYearDay;
  while (day != upperBoundNewYearDay) {
    const _midday = middayAtPersianObservationSite(day);
    const l = compute(_midday);
    if (LONGITUDE_SPRING <= l && l <= TWO_DEGREES_AFTER_SPRING) {
      break;
    }
    day++;
  }
  return day - 1;
}

function getDaysTicks(numberOfDays: number): number {
  const daysTotalTicks = Math.trunc(
    Math.floor(numberOfDays) * SECONDS_PER_DAY * MILLISECONDS_PER_SECOND
  );
  return getJsTimestamp(daysTotalTicks);
}

//#endregion

const _persianEpoch: number = 19603728000000 / MS_PER_DAY;
const _approximateHalfYear = 180;
const _monthsPerYear = 12;
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
  if (year >= 1 && year <= MAX_YEAR && month >= 1 && month <= 12) {
    const ordinalDay = daysInPreviousMonths(month) + day - 1;
    const approximateDaysFromEpochForYearStart = Math.trunc(
      MEAN_TROPICAL_YEAR_IN_DAYS * (year - 1)
    );
    let yearStart = PersianNewYearOnOrBefore(
      _persianEpoch +
        approximateDaysFromEpochForYearStart +
        _approximateHalfYear
    );
    yearStart += ordinalDay;
    return yearStart;
  }
  throwInvalidParam();
}

function getTimestamp(units: DateTimeUnits): number {
  const lDate = getAbsoluteDatePersian(units.year, units.month, units.day);

  if (lDate >= 0) {
    let ticks =
      lDate * MS_PER_DAY +
      timeToTicks(units.hour, units.minute, units.second, units.ms);
    return getJsTimestamp(ticks);
  } else {
    throwInvalidParam();
  }
}

function getDateUnits(ticks: number): DateTimeUnits {
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
  NumDays = Math.trunc(ticks / MS_PER_DAY) + 1;
  const yearStart = PersianNewYearOnOrBefore(NumDays);
  const y =
    Math.floor((yearStart - _persianEpoch) / MEAN_TROPICAL_YEAR_IN_DAYS + 0.5) +
    1;

  const ordinalDay = Math.trunc(
    NumDays -
      getNumberOfDays(
        getTimestamp({
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
  du.year = y;
  du.month = monthFromOrdinalDay(ordinalDay);
  du.day = ordinalDay - daysInPreviousMonths(du.month);
  return du;
}
export class PersianCalendar extends CalendarBase {
  constructor(id: string) {
    super(id, 'persian');
  }

  addMonths(time: number, months: number): number {
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
      y = y + Math.trunc((i - 11) / 12);
    }
    const days = this.daysInMonth(y, m);
    if (d > days) {
      d = days;
    }
    const ticks =
      getAbsoluteDatePersian(y, m, d) * MS_PER_DAY +
      (getCalendarTimestamp(time) % MS_PER_DAY);

    return getJsTimestamp(ticks);
  }
  addYears(time: number, years: number): number {
    return this.addMonths(time, years * 12);
  }
  dayOfYear(time: number): number {
    let NumDays = Math.trunc(getCalendarTimestamp(time) / MS_PER_DAY) + 1;

    const yearStart = PersianNewYearOnOrBefore(NumDays);
    const y =
      Math.floor(
        (yearStart - _persianEpoch) / MEAN_TROPICAL_YEAR_IN_DAYS + 0.5
      ) + 1;

    const ordinalDay = Math.trunc(
      NumDays -
        getNumberOfDays(
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
    if (month == _monthsPerYear && !this.isLeapYear(year)) {
      --daysInMonth;
    }
    return daysInMonth;
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
  isLeapYear(year: number): boolean {
    return (
      getAbsoluteDatePersian(year + 1, 1, 1) -
        getAbsoluteDatePersian(year, 1, 1) ==
      366
    );
  }
  getTimestamp(units: DateTimeUnits): number {
    return getTimestamp(units);
  }

  getUnits(ts: number): DateTimeUnits {
    ts = getCalendarTimestamp(ts);
    return { ...getDateUnits(ts), ...getTimeUnits(ts) };
  }
}
