export function verifyParamType(parameter: any, type: any) {
    if (!(parameter instanceof type)) {
        throw new Error('invalid parameter.');
    }
}

export function hasIntl(): boolean {
    return Intl != null && typeof Intl.DateTimeFormat === 'function';
}
