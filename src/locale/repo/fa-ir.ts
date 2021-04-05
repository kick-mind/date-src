import { Locales } from '../locales';
import { StaticLocale } from '../static-locale';

Locales.add(new StaticLocale({
    id: 'fa-IR',
    weekStart: 6,
    weekdays: [
        'یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه'.split('_'),
        'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
        'ی_د_س_چ_پ_ج_ش'.split('_'),
    ],
    months: {
        gregorian: [
            'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
        ],
        jalaali: [
            'فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند'.split('_'),
        ]
    }
}));
