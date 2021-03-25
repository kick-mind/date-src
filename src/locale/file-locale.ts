import { Locale, LocaleData } from './locale';

/** A locale provided in the package (file-based locale). */
export class FileLocale extends Locale {
    constructor(data: LocaleData) {
        super(data);
    }
}
