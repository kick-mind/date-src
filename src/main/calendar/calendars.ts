/**
 * @category Calendar
 * @module Calendars
 */

import { vObj } from '../common';;
import { Calendar } from './calendar';

const calendars = new Array<Calendar>();
let defaultCalendar: Calendar;

/** 
 * A collection of calendars.
 * @public
 * @abstract
 */
export abstract class Calendars {
    /** Gets or sets the default calendar. */
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
        if (!this.find(c.id, { strict: false })) {
            calendars.push(c);
            if (calendars.length === 1) {
                defaultCalendar = c;
            }
        }
    }

    /** Finds a calendar by id. */
    static find(id: string, opts?: { strict: boolean }): Calendar {
        const c = calendars.find(x => x.id === id);
        if (!c && (opts?.strict === true)) {
            throw new Error('Calendar not found.');
        }
        return c;
    }

    /** Finds all calendars with a specific type. */
    static findByType(type: string): Calendar[] {
        return calendars.filter(x => x.type === type);
    }

    /** Returns a cloned array of all calendars in this collection. */
    static get all(): Calendar[] {
        return [...calendars];
    }
}
