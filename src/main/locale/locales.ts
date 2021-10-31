import { hasIntl, vObj } from '../../common';
import { FALLBACK_LOCALE } from './fallback-locale';
import { Locale } from './locale';
import { RuntimeLocale } from './runtime-locale';

let sysLocale: Locale = hasIntl() ? new RuntimeLocale('system', { weekStart: 0 }) : undefined;
let defLocale: Locale = sysLocale || FALLBACK_LOCALE;
let locales = [defLocale]; // locales repository

/** 
 * A class for managing locales. 
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

    static get default(): Locale {
        return defLocale;
    }

    /**
     * Gets the system locale. If Javascript Intl API is not supported, this method retuens undefined.
     * @public
     * @static
     */
    static get system(): Locale {
        return sysLocale;
    }

    /**
     * Gets the fallback locale. A fallback locale is used when no other suitable locales can be used.
     * @public
     * @static
     */
    static get fallback(): Locale {
        return FALLBACK_LOCALE;
    }

    /**
     * Adds a [Locale] to the locales repository. 
     * @public
     * @static
     */
    static add(l: Locale) {
        vObj(l, Locale);
        // if (locales.find(x => x.name === l.name)) {
        //     throw Error('Locale with the same name exist');
        // }
        locales.push(l);
    }

    /**
     * Tries to resolve a locale.  
     * It first tries to find the locale in the repository. If find operation fails, it tries to create a RuntimeLocale (a locale created by using javascript Intl API).
     * If creating RuntimeLocale fails, this method returns undefined or throws an error (based on "opts.strict" parameter)
     * @public
     * @static
     */
    static resolve(name: string, opts?: { weekStart?: number, strict?: boolean }): Locale {
        let l = locales.find(x => x.name.toLowerCase() === name.toLowerCase());
        if (!l) {
            try {
                l = new RuntimeLocale(name, { weekStart: opts?.weekStart || 0 });
                locales.push(l);
            } catch {
                if (opts?.strict) {
                    throw Error('Could not resolve locale');
                }
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
        return [...locales];
    }
}
