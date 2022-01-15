import {
  DateTime,
  FixedZone,
  Locales,
  DateTimeCreationOptions,
} from '../main';


/** 
 * Parser utils
 * @private
 */
// eslint-disable-next-line import/prefer-default-export
export const t = (format: string) =>
  format.replace(
    /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
    (_, a, b) => a || b.slice(1)
  );

/** 
 * @private
 */
export const englishFormats: any = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/dd/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
};

/** 
 * @private
 */
export const formatHelper = (formatStr: string) =>
  formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
    const B = b && b.toUpperCase();
    return a || englishFormats[b];
  });



const formattingTokens =
  /(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|dd?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;

const match1 = /\d/; // 0 - 9
const match2 = /\d\d/; // 00 - 99
const match3 = /\d{3}/; // 000 - 999
const match4 = /\d{4}/; // 0000 - 9999
const match1to2 = /\d\d?/; // 0 - 99
const matchSigned = /[+-]?\d+/; // -inf - inf
const matchOffset = /[+-]\d\d:?(\d\d)?|Z/; // +00:00 -00:00 +0000 or -0000 +00 or Z
const matchWord = /\d*[^\s\d-_:/()]+/; // Word

function fixLocaleDigits(str: string, localeDigits: string) {
  {
    if (typeof str === 'string') {
      let i = 0;
      for (; i < 10; i++) {
        str = str.replace(new RegExp(localeDigits[i], 'g'), i.toString());
      }
    }
    return str;
  }
}
// tslint:disable-next-line: variable-name
function offsetFromString(string: string) {
  if (!string) {
    return 0;
  }
  if (string === 'Z') {
    return 0;
  }
  const parts: any = string.match(/([+-]|\d\d)/g);
  const minutes = +(parts[1] * 60) + (+parts[2] || 0);
  return minutes === 0 ? 0 : parts[0] === '+' ? -minutes : minutes; // eslint-disable-line no-nested-ternary
}

const addInput = function (property: string) {
  return function (input: number) {
    this[property] = +input;
  };
};

const zoneExpressions = [
  matchOffset,
  function (input: string) {
    const zone = this.zone || (this.zone = {});
    zone.offset = offsetFromString(input);
  },
];

// check if is afternoon
const meridiemMatch = (input: string, isLowerCase: boolean) => {
  return input === (isLowerCase ? 'pm' : 'PM');
};

const expressions: any = {
  A: [
    matchWord,
    function (input: string) {
      this.afternoon = meridiemMatch(input, false);
    },
  ],
  a: [
    matchWord,
    function (input: string) {
      this.afternoon = meridiemMatch(input, true);
    },
  ],
  S: [
    match1,
    function (input: number) {
      this.milliseconds = +input * 100;
    },
  ],
  SS: [
    match2,
    function (input: number) {
      this.milliseconds = +input * 10;
    },
  ],
  SSS: [
    match3,
    function (input: number) {
      this.milliseconds = +input;
    },
  ],
  s: [match1to2, addInput('seconds')],
  ss: [match1to2, addInput('seconds')],
  m: [match1to2, addInput('minutes')],
  mm: [match1to2, addInput('minutes')],
  H: [match1to2, addInput('hours')],
  h: [match1to2, addInput('hours')],
  HH: [match1to2, addInput('hours')],
  hh: [match1to2, addInput('hours')],
  d: [match1to2, addInput('day')],
  dd: [match2, addInput('day')],
  M: [match1to2, addInput('month')],
  MM: [match2, addInput('month')],
  Y: [matchSigned, addInput('year')],
  YY: [match2, addInput('year')],
  YYYY: [match4, addInput('year')],
  Z: zoneExpressions,
  ZZ: zoneExpressions,
};

function correctHours(time: any) {
  const { afternoon } = time;
  if (afternoon !== undefined) {
    const { hours } = time;
    if (afternoon) {
      if (hours < 12) {
        time.hours += 12;
      }
    } else if (hours === 12) {
      time.hours = 0;
    }
    delete time.afternoon;
  }
}

function makeParser(format: any) {
  format = formatHelper(format);
  const array = format.match(formattingTokens);
  const { length } = array;
  for (let i = 0; i < length; i += 1) {
    const token = array[i];
    const parseTo = expressions[token];
    const regex = parseTo && parseTo[0];
    const parser = parseTo && parseTo[1];
    if (parser) {
      array[i] = { regex, parser };
    } else {
      array[i] = token.replace(/^\[|\]$/g, '');
    }
  }
  return function (input: string) {
    const time = {};
    for (let i = 0, start = 0; i < length; i += 1) {
      const token = array[i];
      if (typeof token === 'string') {
        start += token.length;
      } else {
        const { regex, parser } = token;
        const part = input.substr(start);
        const match = regex.exec(part);
        const value = match[0];
        parser.call(time, value);
        input = input.replace(value, '');
      }
    }
    correctHours(time);
    return time;
  };
}

/**
 * Parses a string based on a specified format and returns a DateTime  
 * @param date date string to parse
 * @param format date format
 * @param opts DateTimeCreationOptions
 * @returns A DateTime object
 * @description  
 * List of all available parsing tokens:
 * 
 * | Token | Example | Description                       |
 * | ----- | ------- | --------------------------------- |
 * | YY    | 01      | Two-digit year                    |
 * | YYYY  | 2001    | Four-digit year                   |
 * | M     | 1-12    | Month, beginning at 1             |
 * | MM    | 01-12   | Month, 2-digits                   |
 * | d     | 1-31    | Day of month                      |
 * | dd    | 01-31   | Day of month, 2-digits            |
 * | H     | 0-23    | Hours                             |
 * | HH    | 00-23   | Hours, 2-digits                   |
 * | h     | 1-12    | Hours, 12-hour clock              |
 * | hh    | 01-12   | Hours, 12-hour clock, 2-digits    |
 * | m     | 0-59    | Minutes                           |
 * | mm    | 00-59   | Minutes, 2-digits                 |
 * | s     | 0-59    | Seconds                           |
 * | ss    | 00-59   | Seconds, 2-digits                 |
 * | S     | 0-9     | Hundreds of milliseconds, 1-digit |
 * | SS    | 00-99   | Tens of milliseconds, 2-digits    |
 * | SSS   | 000-999 | Milliseconds, 3-digits            |
 * | Z     | -05:00  | Offset from UTC                   |
 * | ZZ    | -0500   | Compact offset from UTC, 2-digits |
 * | A     | AM PM   | Post or ante meridiem, upper-case |
 * | a     | am pm   | Post or ante meridiem, lower-case |
 */
export function parse(
  date: string,
  format: string,
  opts?: DateTimeCreationOptions
): DateTime {
  const l = Locales.resolve(opts?.locale) || Locales.default;
  const localeDigits = l.formatNumber(123456789, { minimumIntegerDigits: 10 });
  // Your locale-based digits are here, go on ...

  let fixed = fixLocaleDigits(date, localeDigits);
  try {
    const parser = makeParser(format);
    const {
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
      zone,
    }: any = parser(fixed);

    const d = day || 1;
    const y = year || 1;
    const M = month || 1;
    const h = hours || 0;
    const m = minutes || 0;
    const s = seconds || 0;
    const ms = milliseconds || 0;
    if (opts?.zone || !zone) {
      return new DateTime(y, M, d, h, m, s, ms, opts);
    } else {
      return new DateTime(y, M, d, h, m, s, ms, {
        ...opts,
        ...{ zone: new FixedZone(zone.offset, zone.offset) },
      });
    }
  } catch (e) {
    throw new Error('Invalid Date');
  }
}
