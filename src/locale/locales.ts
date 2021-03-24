import { Locale } from './locale';
import { PackageLocale } from './package-locale';
import { SystemLocale } from './system-locale';

const repository = {
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
        if (l instanceof PackageLocale) {
            repository.package[l.id] = l;
        }
        if (l instanceof SystemLocale) {
            repository.system[l.id] = l;
        }
    }

    /**
     * Tries to find a PackageLocale or a SystemLocale.  
     * This method first tries to find a Package or System Locale. if it cannot find a neither of them, tries to create a SystemLocale and returns it.
     * If system locale creation fails, it returns null.
     * @public
     */
    static find(id: string, opts?: { throwError: boolean }): Locale {
        let l = repository.package[id] || repository.system[id];
        if (l) { return l; }

        try {
            l = new SystemLocale(id);
            if (l) { repository.system[id] = l; }
        } catch (e) {
            if (opts && opts.throwError) { throw e; }
        }

        return l;
    }

    /** Gets all locales in the repository (returns a copy of the repository). */
    static all(): Locale[] {
        return [...Object.values<Locale>(repository.package), ...Object.values<Locale>(repository.system)];
    }
}
