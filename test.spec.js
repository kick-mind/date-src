const { DateTime, Calendars, Zones } = require('./dist');
const { PersianCalendar } = require('./dist/calendars/persian');
const { dayOfYear } = require('./dist/plugins/day-of-year');

const pc = new PersianCalendar('pc');
Calendars.add(pc);

const d = new DateTime();
const d2 = d.toZone(Zones.utc);
console.log(d.zone.name);
console.log(d2.hour); 