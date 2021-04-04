import { vObj } from '../common/utils';
import { Calendar } from './calendar';
import { GregorianCalendar } from './gregorian/gregorian';

const calendars = new Array<Calendar>();
let defaultCalendar: Calendar;

export abstract class Calendars {
    /** Fets or sets the default calendar. */
    static set default(value: Calendar) {
        defaultCalendar = value;
    }

    static get default(): Calendar {
        return defaultCalendar;
    }

    /** Adds a [Calendar] to the calendars repository. */
    static add(c: Calendar): void {
        vObj(c, Calendar);
        if (!this.findById(c.id)) {
            calendars.push(c);
            if (calendars.length === 0) {
                defaultCalendar = c;
            }
        }
    }

    /** Finds a calendar by id in the calendars repository. */
    static findById(id: string, opts?: { throwError: boolean }): Calendar {
        const c = calendars.find(x => x.id === id);
        if (!c && opts?.throwError) {
            throw new Error('Calendar not found.');
        }
        return c;
    }

    /** Finds all calendars with a specific type. */
    static findByType(type: string): Calendar[] {
        return calendars.filter(x => x.type === type);
    }

    /** Gets the number of calendars in the repository. */
    static all(): Calendar[] {
        return [...calendars];
    }
}

// Include [GregorianCalendar] by default
const g = new GregorianCalendar();
Calendars.add(g);
Calendars.default = g;
