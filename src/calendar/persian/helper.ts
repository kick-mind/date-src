// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-cons
class AlgoMap {
  constructor(year: number, algorithm: number) {
    this._lowestYear = year;
    this._algorithm = algorithm;
  }
  _lowestYear: number;
  _algorithm: number;
}

const _jsEpoch = 62135596800000;
const _fullCircleOfArc = 360.0; // 360.0;
const _halfCircleOfArc = 180;
const _twelveHours = 0.5; // half a day
const _noon2000Jan01 = 730120.5;
const _longitudeSpring = 0.0;
const _twoDegreesAfterSpring = 2.0;
const _secondsPerDay: number = 24 * 60 * 60;
const _daysInUniformLengthCentury = 36525;
const _millisecondsPerSecond = 1000;
const _secondsPerMinute = 60;
const _minutesPerDegree = 60;
const _startOf1810 = 660723;
const _startOf1900Century = 693595;
const _coeff1900to1987: number[] = [
  -0.00002,
  0.000297,
  0.025184,
  -0.181133,
  0.55304,
  -0.861938,
  0.677066,
  -0.212591,
];
const _coeff1800to1899: number[] = [
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
const _coeff1700to1799: number[] = [
  8.118780842,
  -0.005092142,
  0.003336121,
  -0.0000266484,
];
const _coeff1620to1699: number[] = [196.58333, -4.0675, 0.0219167];
const _lambdaCoefficients: number[] = [280.46645, 36000.76983, 0.0003032];
const _anomalyCoefficients: number[] = [
  357.5291,
  35999.0503,
  -0.0001559,
  -0.00000048,
];
const _eccentricityCoefficients: number[] = [
  0.016708617,
  -0.000042037,
  -0.0000001236,
];
const _coeffA: number[] = [124.9, -1934.134, 0.002063];
const _coeffB: number[] = [201.11, 72001.5377, 0.00057];
export const _meanTropicalYearInDays = 365.242189;
const _meanSpeedOfSun: number = _meanTropicalYearInDays / _fullCircleOfArc;

const _coeff: number[] = [
  angle(23, 26, 21.448),
  angle(0, 0, -46.815),
  angle(0, 0, -0.00059),
  angle(0, 0, 0.001813),
];
const _corrTable: AlgoMap[] = [
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
  return (seconds / _secondsPerMinute + minutes) / _minutesPerDegree + degrees;
}

function obliquity(jcn: number): number {
  return polynomialSum(_coeff, jcn);
}

function getGregorianYear(numberOfDays: number): number {
  const date = new Date(Helper.getDaysTicks(numberOfDays));
  return date.getFullYear();
}

function reminder(divisor: number, dividend: number): number {
  const whole = Math.floor(divisor / dividend);
  return divisor - dividend * whole;
}

function normalizeLongitude(longitude: number): number {
  longitude = reminder(longitude, _fullCircleOfArc);
  if (longitude < 0) {
    longitude += _fullCircleOfArc;
  }
  return longitude;
}

function asDayFraction(longitude: number): number {
  return longitude / _fullCircleOfArc;
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
  const july1stOfYear = Helper.getNumberOfDays(
    new Date(`${gregorianYear}/7/1`).getTime()
  );
  return (july1stOfYear - _startOf1900Century) / _daysInUniformLengthCentury;
}

function defaultCorr(gregorianYear: number): number {
  const january1stOfYear = Math.trunc(
    Helper.getNumberOfDays(new Date(`${gregorianYear}/1/1`).getTime())
  );
  const daysSinceStartOf1810 = january1stOfYear - _startOf1810;
  const x = _twelveHours + daysSinceStartOf1810;
  return (Math.pow(x, 2) / 41048480 - 15) / _secondsPerDay;
}

function corr1988to2019(gregorianYear: number): number {
  return (gregorianYear - 1933) / _secondsPerDay;
}

function corr1900to1987(gregorianYear: number): number {
  const from1900 = centuriesFrom1900(gregorianYear);
  return polynomialSum(_coeff1900to1987, from1900);
}

function corr1800to1899(gregorianYear: number): number {
  const from1900 = centuriesFrom1900(gregorianYear);
  return polynomialSum(_coeff1800to1899, from1900);
}

function corr1700to1799(gregorianYear: number): number {
  const yearsSince1700 = gregorianYear - 1700;
  return polynomialSum(_coeff1700to1799, yearsSince1700) / _secondsPerDay;
}

function corr1620to1699(gregorianYear: number): number {
  const yearsSince1600 = gregorianYear - 1600;
  return polynomialSum(_coeff1620to1699, yearsSince1600) / _secondsPerDay;
}

function corr(time: number): number {
  const year = getGregorianYear(time);
  _corrTable.forEach((map) => {
    if (map._lowestYear <= year) {
      switch (map._algorithm) {
        case 0:
          return defaultCorr(year);
        case 1:
          return corr1988to2019(year);
        case 2:
          return corr1900to1987(year);
        case 3:
          return corr1800to1899(year);
        case 4:
          return corr1700to1799(year);
        case 5:
          return corr1620to1699(year);
      }
    }
  });
  return defaultCorr(year);
}

function jc(moment: number): number {
  const dynamicalMoment = moment + corr(moment);
  return (dynamicalMoment - _noon2000Jan01) / _daysInUniformLengthCentury;
}

function isNegative(value: number): boolean {
  return Math.sign(value) == -1;
}

function copySign(value: number, sign: number): number {
  return isNegative(value) == isNegative(sign) ? value : -value;
}

function equationOfTime(time: number): number {
  const j = jc(time);
  const lambda = polynomialSum(_lambdaCoefficients, j);
  const anomaly = polynomialSum(_anomalyCoefficients, j);
  const eccentricity = polynomialSum(_eccentricityCoefficients, j);
  const epsilon = obliquity(j);
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
  return copySign(Math.min(Math.abs(equation), _twelveHours), equation);
}

function asLocalTime(apparentMidday: number, longitude: number): number {
  const universalTime = apparentMidday - asDayFraction(longitude);
  return apparentMidday - equationOfTime(universalTime);
}
// midday
function midday(date: number, longitude: number): number {
  return asLocalTime(date + _twelveHours, longitude) - asDayFraction(longitude);
}

function initLongitude(longitude: number): number {
  return normalizeLongitude(longitude + _halfCircleOfArc) - _halfCircleOfArc;
}

function middayAtPersianObservationSite(date: number): number {
  return midday(date, initLongitude(52.5));
}

// periodicTerm
function pT(jcn: number, x: number, y: number, z: number): number {
  return x * sinOfDegree(y + z * jcn);
}

function sumLongSequenceOfperiodicTerms(j: number): number {
  // sum
  let s = 0.0;
  s += pT(j, 403406, 270.54861, 0.9287892);
  s += pT(j, 195207, 340.19128, 35999.1376958);
  s += pT(j, 119433, 63.91854, 35999.4089666);
  s += pT(j, 112392, 331.2622, 35998.7287385);
  s += pT(j, 3891, 317.843, 71998.20261);
  s += pT(j, 2819, 86.631, 71998.4403);
  s += pT(j, 1721, 240.052, 36000.35726);
  s += pT(j, 660, 310.26, 71997.4812);
  s += pT(j, 350, 247.23, 32964.4678);
  s += pT(j, 334, 260.87, -19.441);
  s += pT(j, 314, 297.82, 445267.1117);
  s += pT(j, 268, 343.14, 45036.884);
  s += pT(j, 242, 166.79, 3.1008);
  s += pT(j, 234, 81.53, 22518.4434);
  s += pT(j, 158, 3.5, -19.9739);
  s += pT(j, 132, 132.75, 65928.9345);
  s += pT(j, 129, 182.95, 9038.0293);
  s += pT(j, 114, 162.03, 3034.7684);
  s += pT(j, 99, 29.8, 33718.148);
  s += pT(j, 93, 266.4, 3034.448);
  s += pT(j, 86, 249.2, -2280.773);
  s += pT(j, 78, 157.6, 29929.992);
  s += pT(j, 72, 257.8, 31556.493);
  s += pT(j, 68, 185.1, 149.588);
  s += pT(j, 64, 69.9, 9037.75);
  s += pT(j, 46, 8.0, 107997.405);
  s += pT(j, 38, 197.1, -4444.176);
  s += pT(j, 37, 250.4, 151.771);
  s += pT(j, 32, 65.3, 67555.316);
  s += pT(j, 29, 162.7, 31556.08);
  s += pT(j, 28, 341.5, -4561.54);
  s += pT(j, 27, 291.6, 107996.706);
  s += pT(j, 27, 98.5, 1221.655);
  s += pT(j, 25, 146.7, 62894.167);
  s += pT(j, 24, 110.0, 31437.369);
  s += pT(j, 21, 5.2, 14578.298);
  s += pT(j, 21, 342.6, -31931.757);
  s += pT(j, 20, 230.9, 34777.243);
  s += pT(j, 18, 256.1, 1221.999);
  s += pT(j, 17, 45.3, 62894.511);
  s += pT(j, 14, 242.9, -4442.039);
  s += pT(j, 13, 115.2, 107997.909);
  s += pT(j, 13, 151.8, 119.066);
  s += pT(j, 13, 285.3, 16859.071);
  s += pT(j, 12, 53.3, -4.578);
  s += pT(j, 10, 126.6, 26895.292);
  s += pT(j, 10, 205.7, -39.127);
  s += pT(j, 10, 85.9, 12297.536);
  s += pT(j, 10, 146.1, 90073.778);
  return s;
}

function aberration(jcn: number): number {
  return 0.0000974 * cosOfDegree(177.63 + 35999.01848 * jcn) - 0.005575;
}

function nutation(jcn: number): number {
  const a = polynomialSum(_coeffA, jcn);
  const b = polynomialSum(_coeffB, jcn);
  return -0.004778 * sinOfDegree(a) - 0.0003667 * sinOfDegree(b);
}

function compute(time: number): number {
  const j = jc(time);
  const lambda =
    282.7771834 +
    36000.76953744 * j +
    0.000005729577951308232 * sumLongSequenceOfperiodicTerms(j);

  const longitude = lambda + aberration(j) + nutation(j);
  return initLongitude(longitude);
}

function asSeason(longitude: number): number {
  return longitude < 0 ? longitude + _fullCircleOfArc : longitude;
}

function estimatePrior(longitude: number, time: number): number {
  const timeSunLastAtLongitude =
    time - _meanSpeedOfSun * asSeason(initLongitude(compute(time) - longitude));
  const longitudeErrorDelta = initLongitude(
    compute(timeSunLastAtLongitude) - longitude
  );
  return Math.min(
    time,
    timeSunLastAtLongitude - _meanSpeedOfSun * longitudeErrorDelta
  );
}
export class Helper {
  static getNumberOfDays(jsdate: number): number {
    return Math.trunc(
      this.getPersiaTicks(jsdate) / (_secondsPerDay * _millisecondsPerSecond)
    );
  }

  static PersianNewYearOnOrBefore(numberOfDays: number): number {
    const date = numberOfDays;
    const approx = estimatePrior(
      _longitudeSpring,
      middayAtPersianObservationSite(date)
    );
    const lowerBoundNewYearDay = Math.trunc(Math.floor(approx)) - 1;
    const upperBoundNewYearDay = lowerBoundNewYearDay + 3;
    let day = lowerBoundNewYearDay;
    while (day != upperBoundNewYearDay) {
      const _midday = middayAtPersianObservationSite(day);
      const l = compute(_midday);
      if (_longitudeSpring <= l && l <= _twoDegreesAfterSpring) {
        break;
      }
      day++;
    }
    return day - 1;
  }

  static getDaysTicks(numberOfDays: number): number {
    const daysTotalTicks = Math.trunc(
      Math.floor(numberOfDays) * _secondsPerDay * _millisecondsPerSecond
    );
    return this.getJsTicks(daysTotalTicks);
  }

  static getPersiaTicks(ticks: number): number {
    return ticks + _jsEpoch;
  }

  static getJsTicks(ticks: number): number {
    return ticks - _jsEpoch;
  }
}
