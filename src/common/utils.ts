import { jsEpoch } from './const';

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

/** Pads a number */
export function padNumber(value: number, length: number) {
  value.toString().slice(-length).padStart(length, '0');
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
  return ticks + jsEpoch;
}

export function getJsTimestamp(ticks: number): number {
  return ticks - jsEpoch;
}

export function throwInvalidParam(param?: string) {
  throw new Error(`Invalid parameter: [${param}]`);
}
