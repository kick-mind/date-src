
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

export function padNumber(value: number, length: number) {
    value.toString().slice(-length).padStart(length, '0');
}

export function verifyParamType(parameter: any, type: any) {
    if (!(parameter instanceof type)) {
        throw new Error('invalid parameter.');
    }
}
