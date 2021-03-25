import { Locale, LocaleData } from './locale';

/** A locale created by using javascript Intl API. */
export class JsLocale extends Locale {
    constructor(id: string) {
        const data: LocaleData = null;
        // Populate locale data here ...


        super(data);
    }
}
