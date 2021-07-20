
const jss = require('./dist');
const { PersianCalendar } = require('./dist/calendars/persian');

const d = new jss.DateTime();
console.log(d.minute);