import { Locale, LocaleData } from './locale';

export class SystemLocale extends Locale {
    private constructor(data: LocaleData) {
        super(data);
    }

    static get(id: string): SystemLocale {
        throw new Error('Method not implemented.');
    }
}
