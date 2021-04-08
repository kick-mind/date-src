import { StaticLocale } from './static-locale';

const
    m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ms = m.map(x => x.substring(0, 2)),
    mn = m.map(x => x[0]),
    w = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    ws = w.map(x => x.substring(0, 2)),
    wn = w.map(x => m[0]);

/** A fallback locale. */
export const FALLBACK_LOCALE = new StaticLocale({
    name: 'fallback',
    weekStart: 0,
    months: {
        gregorian: [m, ms, mn]
    },
    weekdays: [w, ws, wn]
});
