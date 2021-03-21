// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-cons
enum Algo {
  Default,
  Y1988to2019,
  Y1900to1987,
  Y1800to1899,
  Y1700to1799,
  Y1620to1699,
}

class AlgoMap {
  constructor(year: number, algorithm: Algo) {
    this._lowestYear = year;
    this._algorithm = algorithm;
  }
  _lowestYear: number;
  _algorithm: Algo;
}
export class Helper {
  private static _jsEpoch = 62135596800000;
  private static readonly _fullCircleOfArc: number = 360.0; // 360.0;
  private static readonly _halfCircleOfArc: number = 180;
  private static readonly _twelveHours: number = 0.5; // half a day
  private static readonly _noon2000Jan01: number = 730120.5;
  static readonly _meanTropicalYearInDays: number = 365.242189;
  private static readonly _meanSpeedOfSun: number =
    Helper._meanTropicalYearInDays / Helper._fullCircleOfArc;
  private static readonly _longitudeSpring: number = 0.0;
  private static readonly _twoDegreesAfterSpring: number = 2.0;
  private static readonly _secondsPerDay: number = 24 * 60 * 60;
  private static readonly _daysInUniformLengthCentury: number = 36525;
  private static readonly _millisecondsPerSecond: number = 1000;
  private static readonly _secondsPerMinute: number = 60;
  private static readonly _minutesPerDegree: number = 60;
  private static readonly _maxSupportedDateTime = new Date('9999/12/31');
  private static readonly _startOf1810: number = Helper.getNumberOfDays(
    new Date('1810/1/1').getTime()
  );
  private static readonly _startOf1900Century: number = Helper.getNumberOfDays(
    new Date('1900/1/1').getTime()
  );

  private static _coeff1900to1987: number[] = [
    -0.00002,
    0.000297,
    0.025184,
    -0.181133,
    0.55304,
    -0.861938,
    0.677066,
    -0.212591,
  ];
  private static _coeff1800to1899: number[] = [
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
  private static _coeff1700to1799: number[] = [
    8.118780842,
    -0.005092142,
    0.003336121,
    -0.0000266484,
  ];
  private static _coeff1620to1699: number[] = [196.58333, -4.0675, 0.0219167];
  private static _lambdaCoefficients: number[] = [
    280.46645,
    36000.76983,
    0.0003032,
  ];
  private static _anomalyCoefficients: number[] = [
    357.5291,
    35999.0503,
    -0.0001559,
    -0.00000048,
  ];
  private static _eccentricityCoefficients: number[] = [
    0.016708617,
    -0.000042037,
    -0.0000001236,
  ];
  private static _coeff: number[] = [
    Helper.angle(23, 26, 21.448),
    Helper.angle(0, 0, -46.815),
    Helper.angle(0, 0, -0.00059),
    Helper.angle(0, 0, 0.001813),
  ];
  private static _coeffA: number[] = [124.9, -1934.134, 0.002063];
  private static _coeffB: number[] = [201.11, 72001.5377, 0.00057];

  private static _corrTable: AlgoMap[] = [
    new AlgoMap(2020, Algo.Default),
    new AlgoMap(1988, Algo.Y1988to2019),
    new AlgoMap(1900, Algo.Y1900to1987),
    new AlgoMap(1800, Algo.Y1800to1899),
    new AlgoMap(1700, Algo.Y1700to1799),
    new AlgoMap(1620, Algo.Y1620to1699),
    new AlgoMap(Number.MIN_VALUE, Algo.Default),
  ];

  private static radiansFromDegrees(degree: number): number {
    return (degree * Math.PI) / 180;
  }

  private static sinOfDegree(degree: number): number {
    return Math.sin(this.radiansFromDegrees(degree));
  }

  private static cosOfDegree(degree: number): number {
    return Math.cos(this.radiansFromDegrees(degree));
  }
  private static tanOfDegree(degree: number): number {
    return Math.tan(this.radiansFromDegrees(degree));
  }

  private static angle(
    degrees: number,
    minutes: number,
    seconds: number
  ): number {
    return (
      (seconds / this._secondsPerMinute + minutes) / this._minutesPerDegree +
      degrees
    );
  }

  private static obliquity(jc: number): number {
    return this.polynomialSum(this._coeff, jc);
  }

  static getNumberOfDays(jsdate: number): number {
    return Math.trunc(
      this.getPersiaTicks(jsdate) /
        (this._secondsPerDay * this._millisecondsPerSecond)
    );
  }

  private static getGregorianYear(numberOfDays: number): number {
    const date = new Date(
      Math.min(
        this.getDaysTicks(numberOfDays),
        this._maxSupportedDateTime.getTime()
      )
    );
    return date.getFullYear();
  }

  private static reminder(divisor: number, dividend: number): number {
    const whole = Math.floor(divisor / dividend);
    return divisor - dividend * whole;
  }

  private static normalizeLongitude(longitude: number): number {
    longitude = this.reminder(longitude, this._fullCircleOfArc);
    if (longitude < 0) {
      longitude += this._fullCircleOfArc;
    }
    return longitude;
  }

  private static asDayFraction(longitude: number): number {
    return longitude / this._fullCircleOfArc;
  }

  private static polynomialSum(coeff: number[], indeterminate: number): number {
    let sum = coeff[0];
    let indeterminateRaised = 1;
    for (let i = 1; i < coeff.length; i++) {
      indeterminateRaised *= indeterminate;
      sum += coeff[i] * indeterminateRaised;
    }

    return sum;
  }

  private static centuriesFrom1900(gregorianYear: number): number {
    const july1stOfYear = this.getNumberOfDays(
      new Date(`${gregorianYear}/7/1`).getTime()
    );
    return (
      (july1stOfYear - this._startOf1900Century) /
      this._daysInUniformLengthCentury
    );
  }

  private static defaultCorr(gregorianYear: number): number {
    const january1stOfYear = Math.trunc(
      this.getNumberOfDays(new Date(`${gregorianYear}/1/1`).getTime())
    );
    const daysSinceStartOf1810 = january1stOfYear - this._startOf1810;
    const x = this._twelveHours + daysSinceStartOf1810;
    return (Math.pow(x, 2) / 41048480 - 15) / this._secondsPerDay;
  }

  private static corr1988to2019(gregorianYear: number): number {
    return (gregorianYear - 1933) / this._secondsPerDay;
  }

  private static corr1900to1987(gregorianYear: number): number {
    const centuriesFrom1900 = this.centuriesFrom1900(gregorianYear);
    return this.polynomialSum(this._coeff1900to1987, centuriesFrom1900);
  }

  private static corr1800to1899(gregorianYear: number): number {
    const centuriesFrom1900 = this.centuriesFrom1900(gregorianYear);
    return this.polynomialSum(this._coeff1800to1899, centuriesFrom1900);
  }

  private static corr1700to1799(gregorianYear: number): number {
    const yearsSince1700 = gregorianYear - 1700;
    return (
      this.polynomialSum(this._coeff1700to1799, yearsSince1700) /
      this._secondsPerDay
    );
  }

  private static corr1620to1699(gregorianYear: number): number {
    const yearsSince1600 = gregorianYear - 1600;
    return (
      this.polynomialSum(this._coeff1620to1699, yearsSince1600) /
      this._secondsPerDay
    );
  }

  private static corr(time: number): number {
    const year = this.getGregorianYear(time);
    this._corrTable.forEach((map) => {
      if (map._lowestYear <= year) {
        switch (map._algorithm) {
          case Algo.Default:
            return this.defaultCorr(year);
          case Algo.Y1988to2019:
            return this.corr1988to2019(year);
          case Algo.Y1900to1987:
            return this.corr1900to1987(year);
          case Algo.Y1800to1899:
            return this.corr1800to1899(year);
          case Algo.Y1700to1799:
            return this.corr1700to1799(year);
          case Algo.Y1620to1699:
            return this.corr1620to1699(year);
        }
      }
    });

    return this.defaultCorr(year);
  }

  private static jc(moment: number): number {
    const dynamicalMoment = moment + this.corr(moment);
    return (
      (dynamicalMoment - this._noon2000Jan01) / this._daysInUniformLengthCentury
    );
  }

  private static isNegative(value: number): boolean {
    return Math.sign(value) == -1;
  }

  private static copySign(value: number, sign: number): number {
    return this.isNegative(value) == this.isNegative(sign) ? value : -value;
  }

  private static equationOfTime(time: number): number {
    const jc = this.jc(time);
    const lambda = this.polynomialSum(this._lambdaCoefficients, jc);
    const anomaly = this.polynomialSum(this._anomalyCoefficients, jc);
    const eccentricity = this.polynomialSum(this._eccentricityCoefficients, jc);

    const epsilon = this.obliquity(jc);
    const tanHalfEpsilon = this.tanOfDegree(epsilon / 2);
    const y = tanHalfEpsilon * tanHalfEpsilon;

    const dividend =
      y * this.sinOfDegree(2 * lambda) -
      2 * eccentricity * this.sinOfDegree(anomaly) +
      4 *
        eccentricity *
        y *
        this.sinOfDegree(anomaly) *
        this.cosOfDegree(2 * lambda) -
      0.5 * Math.pow(y, 2) * this.sinOfDegree(4 * lambda) -
      1.25 * Math.pow(eccentricity, 2) * this.sinOfDegree(2 * anomaly);
    const divisor = 2 * Math.PI;
    const equation = dividend / divisor;

    return this.copySign(
      Math.min(Math.abs(equation), this._twelveHours),
      equation
    );
  }

  private static asLocalTime(
    apparentMidday: number,
    longitude: number
  ): number {
    const universalTime = apparentMidday - this.asDayFraction(longitude);
    return apparentMidday - this.equationOfTime(universalTime);
  }
  // midday
  private static midday(date: number, longitude: number): number {
    return (
      this.asLocalTime(date + this._twelveHours, longitude) -
      this.asDayFraction(longitude)
    );
  }

  private static initLongitude(longitude: number): number {
    return (
      this.normalizeLongitude(longitude + this._halfCircleOfArc) -
      this._halfCircleOfArc
    );
  }

  private static middayAtPersianObservationSite(date: number): number {
    return this.midday(date, this.initLongitude(52.5));
  }

  // periodicTerm
  private static pT(jc: number, x: number, y: number, z: number): number {
    return x * this.sinOfDegree(y + z * jc);
  }

  private static sumLongSequenceOfperiodicTerms(jc: number): number {
    // sum
    let s = 0.0;
    s += this.pT(jc, 403406, 270.54861, 0.9287892);
    s += this.pT(jc, 195207, 340.19128, 35999.1376958);
    s += this.pT(jc, 119433, 63.91854, 35999.4089666);
    s += this.pT(jc, 112392, 331.2622, 35998.7287385);
    s += this.pT(jc, 3891, 317.843, 71998.20261);
    s += this.pT(jc, 2819, 86.631, 71998.4403);
    s += this.pT(jc, 1721, 240.052, 36000.35726);
    s += this.pT(jc, 660, 310.26, 71997.4812);
    s += this.pT(jc, 350, 247.23, 32964.4678);
    s += this.pT(jc, 334, 260.87, -19.441);
    s += this.pT(jc, 314, 297.82, 445267.1117);
    s += this.pT(jc, 268, 343.14, 45036.884);
    s += this.pT(jc, 242, 166.79, 3.1008);
    s += this.pT(jc, 234, 81.53, 22518.4434);
    s += this.pT(jc, 158, 3.5, -19.9739);
    s += this.pT(jc, 132, 132.75, 65928.9345);
    s += this.pT(jc, 129, 182.95, 9038.0293);
    s += this.pT(jc, 114, 162.03, 3034.7684);
    s += this.pT(jc, 99, 29.8, 33718.148);
    s += this.pT(jc, 93, 266.4, 3034.448);
    s += this.pT(jc, 86, 249.2, -2280.773);
    s += this.pT(jc, 78, 157.6, 29929.992);
    s += this.pT(jc, 72, 257.8, 31556.493);
    s += this.pT(jc, 68, 185.1, 149.588);
    s += this.pT(jc, 64, 69.9, 9037.75);
    s += this.pT(jc, 46, 8.0, 107997.405);
    s += this.pT(jc, 38, 197.1, -4444.176);
    s += this.pT(jc, 37, 250.4, 151.771);
    s += this.pT(jc, 32, 65.3, 67555.316);
    s += this.pT(jc, 29, 162.7, 31556.08);
    s += this.pT(jc, 28, 341.5, -4561.54);
    s += this.pT(jc, 27, 291.6, 107996.706);
    s += this.pT(jc, 27, 98.5, 1221.655);
    s += this.pT(jc, 25, 146.7, 62894.167);
    s += this.pT(jc, 24, 110.0, 31437.369);
    s += this.pT(jc, 21, 5.2, 14578.298);
    s += this.pT(jc, 21, 342.6, -31931.757);
    s += this.pT(jc, 20, 230.9, 34777.243);
    s += this.pT(jc, 18, 256.1, 1221.999);
    s += this.pT(jc, 17, 45.3, 62894.511);
    s += this.pT(jc, 14, 242.9, -4442.039);
    s += this.pT(jc, 13, 115.2, 107997.909);
    s += this.pT(jc, 13, 151.8, 119.066);
    s += this.pT(jc, 13, 285.3, 16859.071);
    s += this.pT(jc, 12, 53.3, -4.578);
    s += this.pT(jc, 10, 126.6, 26895.292);
    s += this.pT(jc, 10, 205.7, -39.127);
    s += this.pT(jc, 10, 85.9, 12297.536);
    s += this.pT(jc, 10, 146.1, 90073.778);
    return s;
  }

  private static aberration(jc: number): number {
    return 0.0000974 * this.cosOfDegree(177.63 + 35999.01848 * jc) - 0.005575;
  }

  private static nutation(jc: number): number {
    const a = this.polynomialSum(this._coeffA, jc);
    const b = this.polynomialSum(this._coeffB, jc);
    return -0.004778 * this.sinOfDegree(a) - 0.0003667 * this.sinOfDegree(b);
  }

  private static compute(time: number): number {
    const jc = this.jc(time);
    const lambda =
      282.7771834 +
      36000.76953744 * jc +
      0.000005729577951308232 * this.sumLongSequenceOfperiodicTerms(jc);

    const longitude = lambda + this.aberration(jc) + this.nutation(jc);
    return this.initLongitude(longitude);
  }

  private static asSeason(longitude: number): number {
    return longitude < 0 ? longitude + this._fullCircleOfArc : longitude;
  }

  private static estimatePrior(longitude: number, time: number): number {
    const timeSunLastAtLongitude =
      time -
      this._meanSpeedOfSun *
        this.asSeason(this.initLongitude(this.compute(time) - longitude));
    const longitudeErrorDelta = this.initLongitude(
      this.compute(timeSunLastAtLongitude) - longitude
    );
    return Math.min(
      time,
      timeSunLastAtLongitude - this._meanSpeedOfSun * longitudeErrorDelta
    );
  }

  static PersianNewYearOnOrBefore(numberOfDays: number): number {
    const date = numberOfDays;
    const approx = this.estimatePrior(
      this._longitudeSpring,
      this.middayAtPersianObservationSite(date)
    );
    const lowerBoundNewYearDay = Math.trunc(Math.floor(approx)) - 1;
    const upperBoundNewYearDay = lowerBoundNewYearDay + 3;
    let day = lowerBoundNewYearDay;
    while (day != upperBoundNewYearDay) {
      const midday = this.middayAtPersianObservationSite(day);
      const l = this.compute(midday);
      if (this._longitudeSpring <= l && l <= this._twoDegreesAfterSpring) {
        break;
      }
      day++;
    }

    return day - 1;
  }

  static getDaysTicks(numberOfDays: number): number {
    const daysTotalTicks = Math.trunc(
      Math.floor(numberOfDays) *
        this._secondsPerDay *
        this._millisecondsPerSecond
    );
    return (
      daysTotalTicks +
      this.getZoneOffsetFromPersiaTicks(daysTotalTicks) -
      this._jsEpoch
    );
  }

  static getPersiaTicks(date: number): number {
    return date - this.getZoneOffsetFromJsTicks(date) + this._jsEpoch;
  }

  static getJsTicks(ticks: number): number {
    return ticks + Helper.getZoneOffsetFromPersiaTicks(ticks) - Helper._jsEpoch;
  }

  static getZoneOffsetFromPersiaTicks(ticks: number): number {
    const date = new Date(ticks - this._jsEpoch);
    return (
      date.getTimezoneOffset() *
      this._secondsPerMinute *
      this._millisecondsPerSecond
    );
  }

  static getZoneOffsetFromJsTicks(date: number): number {
    return (
      new Date(date).getTimezoneOffset() *
      this._secondsPerMinute *
      this._millisecondsPerSecond
    );
  }
}
