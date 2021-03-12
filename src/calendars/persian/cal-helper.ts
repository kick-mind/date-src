import { Calendar } from "../calendar";



// tslint:disable: variable-name
enum CorrectionAlgorithm {
  Default,
  Year1988to2019,
  Year1900to1987,
  Year1800to1899,
  Year1700to1799,
  Year1620to1699,
}

class EphemerisCorrectionAlgorithmMap {
  constructor(year: number, algorithm: CorrectionAlgorithm) {
    this._lowestYear = year;
    this._algorithm = algorithm;
  }

  _lowestYear: number;
  _algorithm: CorrectionAlgorithm;
}

// tslint:disable: member-ordering
// tslint:disable: variable-name
// tslint:disable: triple-equals
// tslint:disable: prefer-cons
export class CalHelper {
  static readonly _fullCircleOfArc: number = 360.0; // 360.0;
  static readonly _halfCircleOfArc: number = 180;
  static readonly _twelveHours: number = 0.5; // half a day
  static readonly _noon2000Jan01: number = 730120.5;
  static readonly _meanTropicalYearInDays: number = 365.242189;
  static readonly _meanSpeedOfSun: number =
    CalHelper._meanTropicalYearInDays / CalHelper._fullCircleOfArc;
  static readonly _longitudeSpring: number = 0.0;
  static readonly _twoDegreesAfterSpring: number = 2.0;
  static readonly _secondsPerDay: number = 24 * 60 * 60; // 24 hours * 60 minutes * 60 seconds

  static readonly _daysInUniformLengthCentury: number = 36525;
  static readonly _millisecondsPerSecond: number = 1000;
  static readonly _secondsPerMinute: number = 60;
  static readonly _minutesPerDegree: number = 60;

  static readonly _startOf1810: number = CalHelper.getNumberOfDays(
    new Date('1810/1/1')
  );
  static readonly _startOf1900Century: number = CalHelper.getNumberOfDays(
    new Date('1900/1/1')
  );

  static _coefficients1900to1987: number[] = [
    -0.00002,
    0.000297,
    0.025184,
    -0.181133,
    0.55304,
    -0.861938,
    0.677066,
    -0.212591,
  ];
  // tslint:disable-next-line: max-line-length
  static _coefficients1800to1899: number[] = [
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
  static _coefficients1700to1799: number[] = [
    8.118780842,
    -0.005092142,
    0.003336121,
    -0.0000266484,
  ];
  static _coefficients1620to1699: number[] = [196.58333, -4.0675, 0.0219167];
  static _lambdaCoefficients: number[] = [280.46645, 36000.76983, 0.0003032];
  static _anomalyCoefficients: number[] = [
    357.5291,
    35999.0503,
    -0.0001559,
    -0.00000048,
  ];
  static _eccentricityCoefficients: number[] = [
    0.016708617,
    -0.000042037,
    -0.0000001236,
  ];
  // tslint:disable-next-line: max-line-length
  static _coefficients: number[] = [
    CalHelper.angle(23, 26, 21.448),
    CalHelper.angle(0, 0, -46.815),
    CalHelper.angle(0, 0, -0.00059),
    CalHelper.angle(0, 0, 0.001813),
  ];
  static _coefficientsA: number[] = [124.9, -1934.134, 0.002063];
  static _coefficientsB: number[] = [201.11, 72001.5377, 0.00057];
  static _jsEpoch = 62135596800000;

  static _ephemerisCorrectionTable: EphemerisCorrectionAlgorithmMap[] = [
    // lowest year that starts algorithm, algorithm to use
    new EphemerisCorrectionAlgorithmMap(2020, CorrectionAlgorithm.Default),
    new EphemerisCorrectionAlgorithmMap(
      1988,
      CorrectionAlgorithm.Year1988to2019
    ),
    new EphemerisCorrectionAlgorithmMap(
      1900,
      CorrectionAlgorithm.Year1900to1987
    ),
    new EphemerisCorrectionAlgorithmMap(
      1800,
      CorrectionAlgorithm.Year1800to1899
    ),
    new EphemerisCorrectionAlgorithmMap(
      1700,
      CorrectionAlgorithm.Year1700to1799
    ),
    new EphemerisCorrectionAlgorithmMap(
      1620,
      CorrectionAlgorithm.Year1620to1699
    ),
    // new EphemerisCorrectionAlgorithmMap(int.MinValue, CorrectionAlgorithm.Default) // default must be last
    new EphemerisCorrectionAlgorithmMap(
      Number.MIN_VALUE,
      CorrectionAlgorithm.Default
    ), // default must be last
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

  static angle(degrees: number, minutes: number, seconds: number): number {
    return (
      (seconds / this._secondsPerMinute + minutes) / this._minutesPerDegree +
      degrees
    );
  }

  static obliquity(julianCenturies: number): number {
    return this.polynomialSum(this._coefficients, julianCenturies);
  }

  /// Important ***
  static getNumberOfDays(date: Date): number {
    //  debugger;
    //  let x=Math.trunc(this.getTimeTicks(date) / GregorianCalendar._ticksPerDay);
    //  let y= Math.trunc(date.getTime() / GregorianCalendar._ticksPerDay);
    return Math.trunc(date.getTime() / Calendar._ticksPerDay);
    // return Math.trunc(this.getTimeTicks(date) / GregorianCalendar._ticksPerDay);
  }

  /// Important ***
  static getGregorianYear(numberOfDays: number): number {
    const date = new Date(
      Math.min(
        this.getDaysTicks(numberOfDays),
        Calendar._maxSupportedDateTime.getTime()
      )
    );
    return date.getFullYear();
  }

  static reminder(divisor: number, dividend: number): number {
    const whole = Math.floor(divisor / dividend);
    return divisor - dividend * whole;
  }

  static normalizeLongitude(longitude: number): number {
    longitude = this.reminder(longitude, this._fullCircleOfArc);
    if (longitude < 0) {
      longitude += this._fullCircleOfArc;
    }
    return longitude;
  }

  static asDayFraction(longitude: number): number {
    return longitude / this._fullCircleOfArc;
  }

  static polynomialSum(coefficients: number[], indeterminate: number): number {
    let sum = coefficients[0];
    let indeterminateRaised = 1;
    for (let i = 1; i < coefficients.length; i++) {
      indeterminateRaised *= indeterminate;
      sum += coefficients[i] * indeterminateRaised;
    }

    return sum;
  }

  static centuriesFrom1900(gregorianYear: number): number {
    const july1stOfYear = this.getNumberOfDays(
      new Date(`${gregorianYear}/7/1`)
    );
    return (
      (july1stOfYear - this._startOf1900Century) /
      this._daysInUniformLengthCentury
    );
  }

  static defaultEphemerisCorrection(gregorianYear: number): number {
    // debugger;
    const january1stOfYear = Math.trunc(
      this.getNumberOfDays(new Date(`${gregorianYear}/1/1`))
    );
    const daysSinceStartOf1810 = january1stOfYear - this._startOf1810;
    const x = this._twelveHours + daysSinceStartOf1810;
    return (Math.pow(x, 2) / 41048480 - 15) / this._secondsPerDay;
  }

  static ephemerisCorrection1988to2019(gregorianYear: number): number {
    return (gregorianYear - 1933) / this._secondsPerDay;
  }

  static ephemerisCorrection1900to1987(gregorianYear: number): number {
    const centuriesFrom1900 = this.centuriesFrom1900(gregorianYear);
    return this.polynomialSum(this._coefficients1900to1987, centuriesFrom1900);
  }

  static ephemerisCorrection1800to1899(gregorianYear: number): number {
    const centuriesFrom1900 = this.centuriesFrom1900(gregorianYear);
    return this.polynomialSum(this._coefficients1800to1899, centuriesFrom1900);
  }

  static ephemerisCorrection1700to1799(gregorianYear: number): number {
    const yearsSince1700 = gregorianYear - 1700;
    return (
      this.polynomialSum(this._coefficients1700to1799, yearsSince1700) /
      this._secondsPerDay
    );
  }

  static ephemerisCorrection1620to1699(gregorianYear: number): number {
    const yearsSince1600 = gregorianYear - 1600;
    return (
      this.polynomialSum(this._coefficients1620to1699, yearsSince1600) /
      this._secondsPerDay
    );
  }

  // ephemeris-correction: correction to account for the slowing down of the rotation of the earth
  static ephemerisCorrection(time: number): number {
    const year = this.getGregorianYear(time);
    this._ephemerisCorrectionTable.forEach((map) => {
      if (map._lowestYear <= year) {
        switch (map._algorithm) {
          case CorrectionAlgorithm.Default:
            return this.defaultEphemerisCorrection(year);
          case CorrectionAlgorithm.Year1988to2019:
            return this.ephemerisCorrection1988to2019(year);
          case CorrectionAlgorithm.Year1900to1987:
            return this.ephemerisCorrection1900to1987(year);
          case CorrectionAlgorithm.Year1800to1899:
            return this.ephemerisCorrection1800to1899(year);
          case CorrectionAlgorithm.Year1700to1799:
            return this.ephemerisCorrection1700to1799(year);
          case CorrectionAlgorithm.Year1620to1699:
            return this.ephemerisCorrection1620to1699(year);
        }

        //  break; // break the loop and assert eventually
      }
    });

    return this.defaultEphemerisCorrection(year);
  }

  static julianCenturies(moment: number): number {
    const dynamicalMoment = moment + this.ephemerisCorrection(moment);
    return (
      (dynamicalMoment - this._noon2000Jan01) / this._daysInUniformLengthCentury
    );
  }

  static isNegative(value: number): boolean {
    // tslint:disable-next-line: triple-equals
    return Math.sign(value) == -1;
  }

  static copySign(value: number, sign: number): number {
    // tslint:disable-next-line: triple-equals
    return this.isNegative(value) == this.isNegative(sign) ? value : -value;
  }

  static equationOfTime(time: number): number {
    const julianCenturies = this.julianCenturies(time);
    const lambda = this.polynomialSum(
      this._lambdaCoefficients,
      julianCenturies
    );
    const anomaly = this.polynomialSum(
      this._anomalyCoefficients,
      julianCenturies
    );
    const eccentricity = this.polynomialSum(
      this._eccentricityCoefficients,
      julianCenturies
    );

    const epsilon = this.obliquity(julianCenturies);
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

    // approximation of equation of time is not valid for dates that are many millennia in the past or future
    // thus limited to a half day
    return this.copySign(
      Math.min(Math.abs(equation), this._twelveHours),
      equation
    );
  }

  static asLocalTime(apparentMidday: number, longitude: number): number {
    // slightly inaccurate since equation of time takes mean time not apparent time as its argument, but the difference is negligible
    const universalTime = apparentMidday - this.asDayFraction(longitude);
    return apparentMidday - this.equationOfTime(universalTime);
  }
  // midday
  static midday(date: number, longitude: number): number {
    return (
      this.asLocalTime(date + this._twelveHours, longitude) -
      this.asDayFraction(longitude)
    );
  }

  static initLongitude(longitude: number): number {
    return (
      this.normalizeLongitude(longitude + this._halfCircleOfArc) -
      this._halfCircleOfArc
    );
  }

  // midday-in-tehran
  static middayAtPersianObservationSite(date: number): number {
    return this.midday(date, this.initLongitude(52.5)); // 52.5 degrees east - longitude of UTC+3:30 which defines Iranian Standard Time
  }

  static periodicTerm(
    julianCenturies: number,
    x: number,
    y: number,
    z: number
  ): number {
    return x * this.sinOfDegree(y + z * julianCenturies);
  }

  static sumLongSequenceOfperiodicTerms(julianCenturies: number): number {
    let sum = 0.0;
    sum += this.periodicTerm(julianCenturies, 403406, 270.54861, 0.9287892);
    sum += this.periodicTerm(julianCenturies, 195207, 340.19128, 35999.1376958);
    sum += this.periodicTerm(julianCenturies, 119433, 63.91854, 35999.4089666);
    sum += this.periodicTerm(julianCenturies, 112392, 331.2622, 35998.7287385);
    sum += this.periodicTerm(julianCenturies, 3891, 317.843, 71998.20261);
    sum += this.periodicTerm(julianCenturies, 2819, 86.631, 71998.4403);
    sum += this.periodicTerm(julianCenturies, 1721, 240.052, 36000.35726);
    sum += this.periodicTerm(julianCenturies, 660, 310.26, 71997.4812);
    sum += this.periodicTerm(julianCenturies, 350, 247.23, 32964.4678);
    sum += this.periodicTerm(julianCenturies, 334, 260.87, -19.441);
    sum += this.periodicTerm(julianCenturies, 314, 297.82, 445267.1117);
    sum += this.periodicTerm(julianCenturies, 268, 343.14, 45036.884);
    sum += this.periodicTerm(julianCenturies, 242, 166.79, 3.1008);
    sum += this.periodicTerm(julianCenturies, 234, 81.53, 22518.4434);
    sum += this.periodicTerm(julianCenturies, 158, 3.5, -19.9739);
    sum += this.periodicTerm(julianCenturies, 132, 132.75, 65928.9345);
    sum += this.periodicTerm(julianCenturies, 129, 182.95, 9038.0293);
    sum += this.periodicTerm(julianCenturies, 114, 162.03, 3034.7684);
    sum += this.periodicTerm(julianCenturies, 99, 29.8, 33718.148);
    sum += this.periodicTerm(julianCenturies, 93, 266.4, 3034.448);
    sum += this.periodicTerm(julianCenturies, 86, 249.2, -2280.773);
    sum += this.periodicTerm(julianCenturies, 78, 157.6, 29929.992);
    sum += this.periodicTerm(julianCenturies, 72, 257.8, 31556.493);
    sum += this.periodicTerm(julianCenturies, 68, 185.1, 149.588);
    sum += this.periodicTerm(julianCenturies, 64, 69.9, 9037.75);
    sum += this.periodicTerm(julianCenturies, 46, 8.0, 107997.405);
    sum += this.periodicTerm(julianCenturies, 38, 197.1, -4444.176);
    sum += this.periodicTerm(julianCenturies, 37, 250.4, 151.771);
    sum += this.periodicTerm(julianCenturies, 32, 65.3, 67555.316);
    sum += this.periodicTerm(julianCenturies, 29, 162.7, 31556.08);
    sum += this.periodicTerm(julianCenturies, 28, 341.5, -4561.54);
    sum += this.periodicTerm(julianCenturies, 27, 291.6, 107996.706);
    sum += this.periodicTerm(julianCenturies, 27, 98.5, 1221.655);
    sum += this.periodicTerm(julianCenturies, 25, 146.7, 62894.167);
    sum += this.periodicTerm(julianCenturies, 24, 110.0, 31437.369);
    sum += this.periodicTerm(julianCenturies, 21, 5.2, 14578.298);
    sum += this.periodicTerm(julianCenturies, 21, 342.6, -31931.757);
    sum += this.periodicTerm(julianCenturies, 20, 230.9, 34777.243);
    sum += this.periodicTerm(julianCenturies, 18, 256.1, 1221.999);
    sum += this.periodicTerm(julianCenturies, 17, 45.3, 62894.511);
    sum += this.periodicTerm(julianCenturies, 14, 242.9, -4442.039);
    sum += this.periodicTerm(julianCenturies, 13, 115.2, 107997.909);
    sum += this.periodicTerm(julianCenturies, 13, 151.8, 119.066);
    sum += this.periodicTerm(julianCenturies, 13, 285.3, 16859.071);
    sum += this.periodicTerm(julianCenturies, 12, 53.3, -4.578);
    sum += this.periodicTerm(julianCenturies, 10, 126.6, 26895.292);
    sum += this.periodicTerm(julianCenturies, 10, 205.7, -39.127);
    sum += this.periodicTerm(julianCenturies, 10, 85.9, 12297.536);
    sum += this.periodicTerm(julianCenturies, 10, 146.1, 90073.778);
    return sum;
  }

  static aberration(julianCenturies: number): number {
    return (
      0.0000974 * this.cosOfDegree(177.63 + 35999.01848 * julianCenturies) -
      0.005575
    );
  }

  static nutation(julianCenturies: number): number {
    const a = this.polynomialSum(this._coefficientsA, julianCenturies);
    const b = this.polynomialSum(this._coefficientsB, julianCenturies);
    return -0.004778 * this.sinOfDegree(a) - 0.0003667 * this.sinOfDegree(b);
  }

  static compute(time: number): number {
    const julianCenturies = this.julianCenturies(time);
    const lambda =
      282.7771834 +
      36000.76953744 * julianCenturies +
      0.000005729577951308232 *
        this.sumLongSequenceOfperiodicTerms(julianCenturies);

    const longitude =
      lambda +
      this.aberration(julianCenturies) +
      this.nutation(julianCenturies);
    return this.initLongitude(longitude);
  }

  static asSeason(longitude: number): number {
    return longitude < 0 ? longitude + this._fullCircleOfArc : longitude;
  }

  static estimatePrior(longitude: number, time: number): number {
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
    //  debugger;
    const approx = this.estimatePrior(
      this._longitudeSpring,
      this.middayAtPersianObservationSite(date)
    );
    const lowerBoundNewYearDay = Math.trunc(Math.floor(approx)) - 1;
    const upperBoundNewYearDay = lowerBoundNewYearDay + 3;
    let day = lowerBoundNewYearDay;
    // tslint:disable-next-line: triple-equals
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
      Math.floor(numberOfDays) * Calendar._ticksPerDay
    );
    return (
      daysTotalTicks +
      this.getTimeZoonOffSetFromTicks(daysTotalTicks) -
      this._jsEpoch
    );
  }

  static getTimeTicks(date: Date): number {
    return (
      date.getTime() -
      date.getTimezoneOffset() *
        this._secondsPerMinute *
        this._millisecondsPerSecond +
      this._jsEpoch
    );
  }

  static getTimeZoonOffSetFromTicks(ticks: number): number {
    const date = new Date(ticks - this._jsEpoch);
    return (
      date.getTimezoneOffset() *
      this._secondsPerMinute *
      this._millisecondsPerSecond
    );
  }
}
