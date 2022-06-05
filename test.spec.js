const { DateTime, Calendars, Zones } = require('./dist/package');
const { PersianCalendar } = require('./dist/package/calendars/persian');
const { GregorianCalendar2 } = require('./dist/package/calendars/gregorian2');
const { GregorianCalendar } = require('./dist/package/calendars/gregorian');
const { dayOfYear } = require('./dist/package/plugins/day-of-year');

const gc = new GregorianCalendar('gc');
const gc2 = new GregorianCalendar2('gc2');
const pc = new PersianCalendar('pc');
Calendars.add(pc);

const d = new DateTime();
const d2 = d.toZone(Zones.utc);
console.log(d.zone.name);
console.log(d2.hour); 