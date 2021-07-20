
const jss = require('./dist');
const { PersianCalendar } = require('./dist/calendars/persian');
var x = new PersianCalendar();

const d = new jss.DateTime();
console.log(d.minute);