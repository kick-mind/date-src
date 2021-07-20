
const jss = require('./dist');
const { PersianCalendar } = require('./dist/calendars');

const d = new jss.DateTime();
console.log(d.minute);