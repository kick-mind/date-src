import { Locale, LocaleData } from './locale';

/** A locale created by javascript Intl API. */
export class SystemLocale extends Locale {
    private constructor(data: LocaleData) {
        super(data);
    }

    /** Tries to create a system locale. */
    static tryCreate(id: string): SystemLocale {
        throw new Error('Method not implemented.');
    }
}
