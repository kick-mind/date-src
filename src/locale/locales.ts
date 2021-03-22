import { Locale } from './locale';

const repository = new Array<Locale>();
let defaultLocale: Locale;

export abstract class Locales {
    /** gets or Sets the default Locale. */
    static set default(value: Locale) {
        defaultLocale = value;
    }

    static get default(): Locale {
        return defaultLocale;
    }

    /** Adds a [Locale] to the locales repository. */
    static addLocale(l: Locale): void {
        if (!this.find(l.name)) {
            repository.push(l);
            if (repository.length === 0) {
                defaultLocale = l;
            }
        }
    }

    /** Finds a Locale by name in the locale repository. */
    static find(name: string): Locale {
        return repository.find(x => x.name === name);
    }

    /** Gets the number of locales in the repository. */
    static count(): number {
        return repository.length;
    }
}
