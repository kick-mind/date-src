import { DateTime } from '../date-time';

DateTime.addLocale({
    name: 'faIR',
    calendars: {
        gregorian: {
            months: ['ژانویه', 'فوریه'],
            weekDays: ['یکشنبه', 'دوشنبه']
        },
        jalaali: {
            months: ['فروردین', 'اردیبهشت'],
            weekDays: ['یکشنبه', 'دوشنبه']
        }
    }
});
