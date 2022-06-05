/**
 * @internal
 * @module 
 */

/** Locale verification result */
export interface LocaleVerificationResult {
    supported: boolean;
    resolvedName: string;
}

/** Does environment have Intl API support */
export function hasIntl(): boolean {
    return Intl != null && typeof Intl.DateTimeFormat === 'function';
}

/** Verifies a locale */
export function verifyLocale(name: string | null, strict = true, throwErr = false): LocaleVerificationResult {
    let supported: boolean, resolvedName: string;

    try {
        resolvedName = new Intl.DateTimeFormat(name || [], { weekday: 'long' }).resolvedOptions().locale;
        if (strict && name && name.toLowerCase() !== resolvedName.toLowerCase()) {
            throw Error();
        }
        supported = true;
    } catch {
        if (throwErr) {
            throw Error('Unsupported locale');
        }
        supported = false;
    }

    return { supported, resolvedName };
}
