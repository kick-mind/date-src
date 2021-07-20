
const jss = require('./dist');
const { PersianCalendar } = require('./dist/calendars/persian');
const { dayOfYear } = require('./dist/plugins/day-of-year');

var x = new PersianCalendar();

const d = new jss.DateTime();
console.log(d.minute);