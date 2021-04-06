import { vObj } from '../common/utils';
import { Calendar } from './calendar';
import { GregorianCalendar } from './gregorian/gregorian';

const calendars = new Array<Calendar>();
let defaultCalendar = new GregorianCalendar('gregorian');

/** 
 * A class with some static methods for managing calendars. 
 * @public
 * @abstract
 */
export abstract class Calendars {
    /** Fets or sets the default calendar. */
    static set default(value: Calendar) {
        vObj(value, Calendar);
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

    /** Finds a calendar by id. */
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

    /** Returns a cloned array of all calendars in the repository. */
    static get all(): Calendar[] {
        return [...calendars];
    }
}

// Include [GregorianCalendar] by default
Calendars.add(defaultCalendar);
