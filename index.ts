import { PersianDate } from './src/dates/persian';

const pd = new PersianDate({ year: 1400, month: 1, day: 1, hour: 0, minute: 0, second: 0, ms: 0 });
console.log(pd.values);
