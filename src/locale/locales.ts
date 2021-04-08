import { hasIntl, vObj } from '../common';
import { Locale } from './locale';
import { RuntimeLocale } from './runtime-locale';

let sysLocale: Locale = hasIntl() ? new RuntimeLocale(null, { weekStart: 0 }) : undefined;
let defLocale: Locale = sysLocale;
let repository = defLocale ? [defLocale] : [];

/** 
 * A class with some static methods for managing locales. 
 * @public
 * @abstract
 */
export abstract class Locales {
    /** 
     * Gets or sets the default locale.
     * @public
     * @static
     */
    static set default(l: Locale) {
        vObj(l, Locale);
        defLocale = l;
    }

    /** 
     * Gets the default locale.
     * @public
     * @static
     */
    static get default(): Locale {
        return defLocale;
    }

    /**
     * Tries to return system locale. If Javascript Intl API is not supported, this method retuens undefined.
     * @public
     * @static
     */
    static getSystemLocale(): Locale {
        return sysLocale;
    }

    /**
     *  Adds a [Locale] to the locales repository. 
     * @public
     * @static
     */
    static add(l: Locale) {
        vObj(l, Locale);
        if (repository.find(x => x.resolvedName === l.resolvedName)) {
            throw Error('Locale with the same (resolved) name exist');
        }
        repository.push(l);
    }

    /**
     * Tries to resolve a locale. It first tries to find the locale in the repository.
     * If find operation fails, it tries to create a RuntimeLocale (a locale created by javascript Intl API).
     * If creating RuntimeLocale fails, this method returns undefined or throws an error (based on "opts.throwError" parameter)
     * @public
     * @static
     */
    static resolve(name: string, opts?: { weekStart?: number, throwError?: boolean }): Locale {
        let l = repository.find(x => x.resolvedName.toLowerCase() === name.toLowerCase());
        if (!l) {
            try {
                l = new RuntimeLocale(name, { weekStart: opts?.weekStart || 0 });
                repository.push(l);
            } catch (e) {
                if (opts && opts.throwError) { throw e; }
            }
        }

        return l;
    }

    /** 
     * Returns a cloned array of all locales in the repository.
     * @public
     * @static
     */
    static get all(): Locale[] {
        return [...repository];
    }
}
