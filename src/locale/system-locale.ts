import { Locale, LocaleData } from './locale';

/** A locale created by using javascript Intl API. */
export class SystemLocale extends Locale {
    constructor(id: string) {
        const data: LocaleData = null;


        super(data);
    }
}
