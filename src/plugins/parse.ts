import { formatHelper } from '../common';
import {
  DateTime,
  CalendarSpecifier,
  ZoneSpecifier,
  LocaleSpecifier,
  FixedZone,
} from '../main';

const formattingTokens =
  /(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;

const match1 = /\d/; // 0 - 9
const match2 = /\d\d/; // 00 - 99
const match3 = /\d{3}/; // 000 - 999
const match4 = /\d{4}/; // 0000 - 9999
const match1to2 = /\d\d?/; // 0 - 99
const matchSigned = /[+-]?\d+/; // -inf - inf
const matchOffset = /[+-]\d\d:?(\d\d)?|Z/; // +00:00 -00:00 +0000 or -0000 +00 or Z
const matchWord = /\d*[^\s\d-_:/()]+/; // Word

// remove
let locale: any = {};

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

const getLocalePart = (name: string) => {
  const part = locale[name];
  return part && (part.indexOf ? part : part.s.concat(part.f));
};

const meridiemMatch = (input: string, isLowerCase: boolean) => {
  let isAfternoon;
  const { meridiem } = locale;
  if (!meridiem) {
    isAfternoon = input === (isLowerCase ? 'pm' : 'PM');
  } else {
    for (let i = 1; i <= 24; i += 1) {
      // todo: fix input === meridiem(i, 0, isLowerCase)
      if (input.indexOf(meridiem(i, 0, isLowerCase)) > -1) {
        isAfternoon = i > 12;
        break;
      }
    }
  }
  return isAfternoon;
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
  D: [match1to2, addInput('day')],
  DD: [match2, addInput('day')],
  Do: [
    matchWord,
    function (input: string) {
      const { ordinal } = locale;
      [this.day] = input.match(/\d+/);
      if (!ordinal) {
        return;
      }
      for (let i = 1; i <= 31; i += 1) {
        if (ordinal(i).replace(/\[|\]/g, '') === input) {
          this.day = i;
        }
      }
    },
  ],
  M: [match1to2, addInput('month')],
  MM: [match2, addInput('month')],
  MMM: [
    matchWord,
    function (input: string) {
      const months = getLocalePart('months');
      const monthsShort = getLocalePart('monthsShort');
      const matchIndex =
        (monthsShort || months.map((_: any) => _.substr(0, 3))).indexOf(input) +
        1;
      if (matchIndex < 1) {
        throw new Error();
      }
      this.month = matchIndex % 12 || matchIndex;
    },
  ],
  MMMM: [
    matchWord,
    function (input: string) {
      const months = getLocalePart('months');
      const matchIndex = months.indexOf(input) + 1;
      if (matchIndex < 1) {
        throw new Error();
      }
      this.month = matchIndex % 12 || matchIndex;
    },
  ],
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
  format = formatHelper(format, locale && locale.formats);
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

export function parse(
  date: string,
  format: string,
  opts?: {
    calendar?: CalendarSpecifier;
    zone?: ZoneSpecifier;
    locale?: LocaleSpecifier;
  }
): DateTime {
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
    }: any = parser(date);

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
    return new DateTime(null); // Invalid Date
  }
}
