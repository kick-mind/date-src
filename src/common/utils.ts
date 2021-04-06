import { JsEpoch, MsPerHour, MsPerMinute, MsPerSecond } from './const';

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

/** Verifies an object to ensure that it has a specific type */
export function vObj(
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
export function vType(
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
export function vClsCall(inst: any, cls: any) {
  if (!(inst instanceof cls)) {
    throw new TypeError('Cannot call a class as a function');
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

/** Freezes an object deeply */
export function deepFreeze(obj: any) {
  for (const name of Object.getOwnPropertyNames(obj)) {
    let v = obj[name];
    if (v && typeof v === 'object') {
      deepFreeze(v);
    }
  }

  return Object.freeze(obj);
}
