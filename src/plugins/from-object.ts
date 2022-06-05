import { DateTime, DateTimeCreationOptions, DateTimeUnits } from '../main';

/** 
 * Creates a DateTime from an object
 * @public
 */
export function fromObject(units: DateTimeUnits, opts?: DateTimeCreationOptions): DateTime {
    const u = units;
    return new DateTime(u.year, u.month, u.day, u.hour, u.minute, u.second, u.ms, opts);
}
