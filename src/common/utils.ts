import { JsEpoch, MsPerHour, MsPerMinute, MsPerSecond } from './const';

export function hasIntl(): boolean {
  return Intl != null && typeof Intl.DateTimeFormat === 'function';
}

export function IsStr(x: any) {
  return typeof x === 'string';
}

export function IsInt(x: any) {
  return Number.isInteger(x);
}

export function IsObj(x: any) {
  return typeof x == 'object';
}

export function throwInvalidParam(param?: string) {
  throw new Error(`Invalid parameter(s)${param ? ': ' + param : ''}`);
}

/** Pads a number */
export function padNum(value: number, length: number) {
  return value.toString().slice(-length).padStart(length, '0');
}

/** Verifies an object's to ensure that it has a specific type */
export function verifyObject(
  x: any,
  type: any,
  required = true,
  err = 'invalid parameter.'
) {
  if ((x == null && required) || !(x instanceof type)) {
    throw new Error(err);
  }
}

/** Verifies an object's type */
export function verifyType(
  x: any,
  type: 'object' | 'string' | 'number' | 'boolean' | 'function',
  required = true,
  err = 'invalid parameter.'
) {
  if ((x == null && required) || typeof x != type) {
    throw new Error(err);
  }
}

/** Verifies class call and ensures that a class is called by new operator */
export function verifyClassCall(inst: any, cls: any) {
  if (!(inst instanceof cls)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

/** Determines if a locale is supported by the Javascript environment or not. */
export function isSupportedLocale(name: string) {
  try {
    return (
      Intl.DateTimeFormat.supportedLocalesOf([name], {
        localeMatcher: 'lookup',
      }).length == 1
    );
  } catch {
    return false;
  }
}

/** If the given locale is not supported, throws an error */
export function verifyLocale(name: string, err = 'Unsupported locale') {
  if (!isSupportedLocale(name)) {
    throw new Error(err);
  }
}

export function getCalendarTimestamp(ticks: number): number {
  return ticks + JsEpoch;
}

export function getJsTimestamp(ticks: number): number {
  return ticks - JsEpoch;
}

export function timeToTicks(
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
    ms < MsPerSecond
  ) {
    return (
      hour * MsPerHour + minute * MsPerMinute + second * MsPerSecond + ms
    );
  }
  throwInvalidParam();
}