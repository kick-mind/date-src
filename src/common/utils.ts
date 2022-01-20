/**
 * @internal
 */


import { JS_EPOCH, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND } from './const';

/** 
 * @private
 */
export function IsStr(x: any) {
  return typeof x === 'string';
}

/** 
 * @private
 */
export function IsInt(x: any) {
  return Number.isInteger(x);
}

/** 
 * @private
 */
export function IsObj(x: any) {
  return typeof x == 'object';
}

/** 
 * @private
 */
export function throwInvalidParam(param?: string) {
  throw new Error(`Invalid parameter${param ? ': ' + param : ''}`);
}

/** 
 * Pads a number
 * @private
 */
export function padNum(value: number, length: number) {
  return value.toString().slice(-length).padStart(length, '0');
}

/** 
 * Verifies an object to ensure that it has a specific type 
 * @private
 */
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

/** 
 * Verifies an object's type 
 * @private
 */
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

/** 
 * Verifies class call and ensures that a class is called by new operator
 * @private
 */
export function vClsCall(inst: any, cls: any) {
  if (!(inst instanceof cls)) {
    throw new Error('Cannot call a class as a function');
  }
}

/** 
 * @private
 */
export function getCalendarTimestamp(ticks: number): number {
  return ticks + JS_EPOCH;
}

/** 
 * @private
 */
export function getJsTimestamp(ticks: number): number {
  return ticks - JS_EPOCH;
}

/** 
 * @private
 */
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
    ms < MS_PER_SECOND
  ) {
    return (
      hour * MS_PER_HOUR + minute * MS_PER_MINUTE + second * MS_PER_SECOND + ms
    );
  }
  throwInvalidParam();
}

/** 
 * Freezes an object deeply
 * @private
 */
export function deepFreeze(obj: any) {
  for (const name of Object.getOwnPropertyNames(obj)) {
    let v = obj[name];
    if (v && typeof v === 'object') {
      deepFreeze(v);
    }
  }

  return Object.freeze(obj);
}