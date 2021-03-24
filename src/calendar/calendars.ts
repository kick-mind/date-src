import { verifyParamType } from 'src/common/utils';
import { Calendar2 } from './calendar__';

const calendars = new Array<Calendar2>();
let defaultCalendar: Calendar2;

export abstract class Calendars {
    /** Fets or sets the default calendar. */
    static set default(value: Calendar2) {
        defaultCalendar = value;
    }

    static get default(): Calendar2 {
        return defaultCalendar;
    }

    /** Adds a [Calendar] to the calendars repository. */
    static add(c: Calendar2): void {
        verifyParamType(c, Calendar2);
        if (!this.find(c.id)) {
            calendars.push(c);
            if (calendars.length === 0) {
                defaultCalendar = c;
            }
        }
    }

    /** Finds a calendar by name in the calendars repository. */
    static find(name: string, opts?: { throwError: boolean }): Calendar2 {
        const c = calendars.find(x => x.name === name);
        if (!c && opts?.throwError) {
            throw new Error('Calendar not found.');
        }
        return c;
    }

    /** Gets the number of calendars in the repository. */
    static all(): Calendar2[] {
        return [...calendars];
    }
}
