
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
export function verifyObject(x: any, type: any, err = 'invalid parameter.') {
    if (!(x instanceof type)) {
        throw new Error(err);
    }
}

/** Verifies an object's type */
export function verifyType(x: any, type: 'object' | 'string' | 'number' | 'boolean' | 'function', err = 'invalid parameter.') {
    if (!(typeof x == type)) {
        throw new Error(err);
    }
}

/** Verifies class call and ensures that a class is called by new operator */
export function verifyClassCall(inst: any, cls: any) {
    if (!(inst instanceof cls)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
