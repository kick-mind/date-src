/**
 * @category Locale
 * @module Locales
 */


import { LocaleSpecifier } from '..';
import { StaticLocale } from './static-locale';
import { hasIntl, vObj } from '../common';
import { Locale } from './locale';
import { RuntimeLocale } from './runtime-locale';

function fallback() {
    const
        m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ms = m.map(x => x.substring(0, 2)),
        mn = m.map(x => x[0]),
        w = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        ws = w.map(x => x.substring(0, 2)),
        wn = w.map(x => m[0]);

    return new StaticLocale({
        name: 'fallback',
        weekStart: 0,
        months: {
            gregorian: [m, ms, mn]
        },
        weekdays: [w, ws, wn]
    });
}

const FALLBACK_LOCALE = fallback();
let sysLocale: Locale = hasIntl() ? new RuntimeLocale('system', { weekStart: 0 }) : undefined;
let defLocale: Locale = sysLocale || FALLBACK_LOCALE;
let locales = [defLocale]; // locales repository

function findLocale(name: string, weekStart: number) {
    return locales.find(x => x.name === name && x.weekStart === weekStart);
}

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
        locales.push(l);
    }

    /**
     * Tries to resolve a locale.  
     * It first tries to find the locale in the repository. If find operation fails, it tries to create a RuntimeLocale (a locale created by using javascript Intl API).
     * If creating RuntimeLocale fails, this method returns undefined or throws an error (based on "opts.strict" parameter).
     * @public
     * @static
     */
    static resolve(locale: LocaleSpecifier, opts?: { strict?: boolean }): Locale {
        let l: Locale;

        try {
            if (locale instanceof Locale) {
                l = locale;
            } else if (typeof locale === 'object') {
                const { name, weekStart } = locale;
                l = findLocale(name, weekStart) ?? new RuntimeLocale(name, { weekStart });
            } else if (typeof locale === 'string') {
                l = findLocale(locale, 0) ?? new RuntimeLocale(locale, { weekStart: 0 });
            } else {
                throw Error();
            }
        } catch {
            if (opts?.strict) {
                throw Error('Could not resolve locale');
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
