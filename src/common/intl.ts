/** Locale verification result */
export interface LocaleVerificationResult {
    supported: boolean;
    resolvedId: string;
}

/** Does environment have Intl API support */
export function hasIntl(): boolean {
    return Intl != null && typeof Intl.DateTimeFormat === 'function';
}

/** Verifies a locale */
export function verifyLocale(id: string | null, strict = true, throwErr = false): LocaleVerificationResult {
    let supported: boolean, resolvedId: string;

    try {
        resolvedId = new Intl.DateTimeFormat(id || [], { weekday: 'long' }).resolvedOptions().locale;
        if (strict && id && id.toLowerCase() !== resolvedId.toLowerCase()) {
            throw Error();
        }
        supported = true;
    } catch {
        if (throwErr) {
            throw Error('Unsupported locale');
        }
        supported = false;
    }

    return { supported, resolvedId };
}
