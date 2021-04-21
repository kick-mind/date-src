import { DateTimeUnits } from '../common';
import { DateTime, DateTimeCreateOptions } from '../date-time';

/** 
 * Creates a DateTime from an object
 * @public
 */
function fromObject(units: DateTimeUnits, opts?: DateTimeCreateOptions): DateTime {
    const u = units;
    return new DateTime(u.year, u.month, u.day, u.hour, u.minute, u.second, u.ms, opts);
}
