import { Locale } from './locale';

const repository = new Array<Locale>();
let defaultLocale: Locale;

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
        if (!this.get(l.id)) {
            repository.push(l);
            if (repository.length === 0) {
                defaultLocale = l;
            }
        }
    }

    /** Finds a Locale by name in the locale repository. */
    static get(id: string): Locale {
        return repository.find(x => x.id === id);
    }

    /** Gets the number of locales in the repository. */
    static count(): number {
        return repository.length;
    }
}
