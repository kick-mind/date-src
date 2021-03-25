import { Locale, LocaleData } from './locale';

/** A locale provided in the package (file-based locale). */
export class PackageLocale extends Locale {
    constructor(data: LocaleData) {
        super(data);
    }
}
