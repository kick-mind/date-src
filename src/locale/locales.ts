import { verifyObject } from '../common/utils';
import { Locale } from './locale';
import { FileLocale } from './file-locale';
import { JsLocale } from './js-locale';

const cache = {
    package: {} as any,
    system: {} as any,
};

let defaultLocale: Locale;

/** A class with some static methods for managing locales. */
export abstract class Locales {
    /** Gets or sets the default locale. */
    static set default(value: Locale) {
        defaultLocale = value;
    }

    static get default(): Locale {
        return defaultLocale;
    }

    /** Adds a [Locale] to the locales repository. */
    static add(l: Locale) {
        verifyObject(l, Locale);
        if (l instanceof FileLocale) {
            cache.package[l.id] = l;
        } else {
            cache.system[l.id] = l;
        }
    }

    /**
     * This method tries to find a file based or a Javascript based (Intl API) Locale.
     * @public
     */
    static find(id: string, opts?: { throwError: boolean }): Locale {
        let l = cache.package[id] || cache.system[id];
        if (l) { return l; }

        try {
            l = new JsLocale(id);
            if (l) { cache.system[id] = l; }
        } catch (e) {
            if (opts && opts.throwError) { throw e; }
        }

        return l;
    }

    /** Gets all locales in the repository. */
    static all(): Locale[] {
        return [...Object.values<Locale>(cache.package), ...Object.values<Locale>(cache.system)];
    }
}
