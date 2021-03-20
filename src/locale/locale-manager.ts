import { Locale } from './locale';

export abstract class LocaleManager {
    private static _repository = new Array<Locale>();
    private static _default: Locale;

    /** gets or Sets the default Locale. */
    static set default(value: Locale) {
        this._default = value;
    }

    static get default(): Locale {
        return this._default;
    }

    /** Adds a Locale. */
    // tslint:disable-next-line: member-ordering
    static addLocale(locale: Locale): void {
        this._repository.push(locale);

        if (this._repository.length === 0) {
            this._default = locale;
        }
    }

    /** Finds a Locale by name. */
    // static findLocale(localeName: string): Locale {
    //     const l = this._repository.find(x => x.name === localeName);
    //     return l ? { ...l } : null;
    // }

}
