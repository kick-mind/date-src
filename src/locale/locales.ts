import { hasIntl, verifyObject } from '../common/utils';
import { Locale } from './locale';
import { JsLocale } from './js-locale';
import { FallbackLocale } from './fallback-locale';

let repo: Locale[] = [];
let sysLocale: JsLocale; // System Locale
let defLocale: Locale;

/** A class with some static methods for managing locales. */
export abstract class Locales {
    /** Gets or sets the default locale. */
    static set default(l: Locale) {
        verifyObject(l, Locale);
        defLocale = l;
    }

    /** Gets the default locale. */
    static get default(): Locale {
        return defLocale;
    }

    /** Gets the system locale. */
    static get system(): Locale {
        if (!sysLocale) {
            sysLocale = hasIntl() ?
                new JsLocale(JsLocale.getSystemLocaleId(), { weekStart: 0 }) : // We can not compute the weekstart by javascript.
                new FallbackLocale();
        }
        return sysLocale;
    }

    /** Adds a [Locale] to the locales repository. */
    static add(l: Locale) {
        verifyObject(l, Locale);
        if (!repo.find(x => x === l)) {
            repo.push(l);
        }
    }

    /**
     * Tries to find a locale in the repository.
     * @public
     */
    static find(id: string, opts?: { throwError: boolean }): Locale {
        let l = repo.find(x => x.id === id);
        if (!l && opts && opts.throwError) {
            throw new Error('Locale not found');
        }
        return l;
    }

    /**
     * Tries to find a locale in the repository. If fails, creates a JsLocale, adds it to the repository and return it.
     * @public
     */
    static resolve(id: string, opts?: { weekStart: number }): Locale {
        let l = this.find(id);
        if (!l) {
            l = new JsLocale(id, { weekStart: opts?.weekStart ?? 0 });
        }
        return l;
    }

    /** Clears the locales repository. */
    static clear() {
        repo = [];
    }

    /** Returns a cloned array of all locales in the repository. */
    static all(): Locale[] {
        return [...repo];
    }
}

Locales.add(Locales.system);
Locales.default = Locales.system;
