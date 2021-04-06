import { hasIntl, vObj } from '../common';
import { Locale } from './locale';
import { RuntimeLocale } from './runtime-locale';
import { FALLBACK_LOCALE } from './fallback';

let sysLocale: Locale = hasIntl() ? new RuntimeLocale('system', null, { weekStart: 0 }) : undefined;
let defLocale: Locale = sysLocale || FALLBACK_LOCALE;
let repo = [defLocale];

/** 
 * A class with some static methods for managing locales. 
 * @public
 * @abstract
 */
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
        if (repo.find(x => x.id === l.id)) {
            throw Error('Locale with the same id exist');
        }
        repo.push(l);
    }

    /**
     * Finds a locale in the repository by ID.
     * @public
     */
    static find(id: string): Locale {
        return repo.find(x => x.id === id);
    }

    // TODO: Incomplete doc
    /**
     * Tries to resolve a locale. It first tries to create a RuntimeLocale.
     * If fails (you runtime environment doesn't support Intl API) ... .
     * @public
     */
    static resolve(name: string, opts?: { weekStart: number }): Locale {
        let l: Locale;
        let matchs = repo.filter(x => x.resolvedName.toLowerCase() === name.toLowerCase());

        if (matchs.length == 0) {
            l = new RuntimeLocale(`${name}.r`, name, { weekStart: opts?.weekStart ?? 0 });
        } else {
            l = matchs.find(x => x instanceof RuntimeLocale); // We prefer runtime locales
            l = l || matchs[0];
        }
        return l;
    }

    /** Returns a cloned array of all locales in the repository. */
    static get all(): Locale[] {
        return [...repo];
    }
}

Locales.add(Locales.default);
