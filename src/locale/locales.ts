import { hasIntl, vObj } from '../common';
import { Locale } from './locale';
import { RuntimeLocale } from './runtime-locale';
import { FallbackLocale } from './fallback-locale';

let repo: Locale[] = [];
let defLocale = hasIntl() ? new RuntimeLocale(null, { weekStart: 0 }) : new FallbackLocale();
let sysLocale = defLocale instanceof RuntimeLocale ? defLocale : undefined;

/** A class with some static methods for managing locales. */
export abstract class Locales {
    /** Gets or sets the default locale. */
    static set default(l: Locale) {
        vObj(l, Locale);
        defLocale = l;
    }

    /** Gets the default locale. */
    static get default(): Locale {
        return defLocale;
    }

    /** Tries to return system locale. If Javascript Intl API is not supported, this method retuens undefined. */
    static getSystemLocale(): Locale {
        return sysLocale;
    }

    /** Adds a [Locale] to the locales repository. */
    static add(l: Locale) {
        vObj(l, Locale);
        if (!repo.find(x => x === l)) {
            repo.push(l);
        }
    }

    /**
     * Tries to find a locale in the repository.
     * @public
     */
    static find(id: string, opts?: { throwError: boolean }): Locale {
        let l = repo.find(x => x.resolvedId === id);
        if (!l && opts && opts.throwError) {
            throw new Error('Locale not found');
        }
        return l;
    }

    // TODO: Incomplete doc
    /**
     * Tries to resolve a locale. It first tries to create a RuntimeLocale.
     * If fails (you runtime environment doesn't support Intl API) ... .
     * @public
     */
    static resolve(id: string, opts?: { weekStart: number }): Locale {
        let l = this.find(id);
        if (!l) {
            l = new RuntimeLocale(id, { weekStart: opts?.weekStart ?? 0 });
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

Locales.add(Locales.default);
