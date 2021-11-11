# JSS-Date

Jss-date  is a  multi-calendar, lightweight and rich JavaScript library for parsing, validating, manipulating, formatting, and displaying dates and times for all the Javascript environments (NodeJS, browser). It supports many calendars including Gregorian, Gregorian2, Persian, and Islamic (Hjri) in which you can easily convert datetimes between calendars and time zones.

## Main Features

- Multi-Calendar
  - Independent
    - The library is not dependent on any other calendar.
  - Extensible
    - Easily add your own calendar by inheriting from a base class and implementing abstract methods.
  - Pre-implemented calendars
    - Gregorian
    - Gregorian2
    - Islamic (Hijri)
    - Persian
    - ...(More calendars will be added in the future)
  - Accurate
    - See our tests in github (soon)
- Date range support
  - Gregorian Calendar: (It wraps javascript date. [date range support: since January 01, 1970, 00:00:00 UTC]. )
  - Gregorian2, Persian and Islamic(Hijri) Calendar: (Independent of javascript date wide date range support from 1/1/1 to 12/30/9999)
- Localization support
  - Intl-API based locales
  - File based locales (soon)
- Timezone support
  - Intl-API based timezones
  - File based timezones (soon)
- Immutable
  - All objects (DateTime, Calendar, Locale, Zone, Duration) are immutable.
- Extensible
  - Calendars, locales and zones can be extended.
- Treeshakable
  - All calendars, locales, zones and plugins are tree-shakable. you only import things you need into your project.
- Lightweight
  - Core library size is around 15KB minified (5KB minified and Gzipped)
- NodeJS and browser support


## Installation command

```node
npm install @js-sugar/date
```

## How Jss-date works
Import the calendars you need in your project, instantiate and add them to the Calendars pool. 

> Note:  
You have to add atleast one calendar to the Calendars pool.


Add the following code at the starting point of your application:

```
import { DateTime, Calendars } from '@js-sugar/date';
import { GregorianCalendar }  from '@js-sugar/date/calendars/gregorian';
import { GregorianCalendar2 } from '@js-sugar/date/calendars/gregorian2';
import { PersianCalendar }  from '@js-sugar/date/calendars/persian';
import { HijriCalendar } from '@js-sugar/date/calendars/hijri';

// You can add multiple instances of a calendar with unique id to the Calendars pool.
// add only the calenders you want to use in your project.

Calendars.add(new GregorianCalendar('gregorian'));   // add a Gregorian calendar with a unique ID:[ 'grigorian' ]
Calendars.add(new GregorianCalendar2('gregorian2')); // add a Gregorian2 calendar with a unique ID:[ 'grigorian2' ]
Calendars.add(new PersianCalendar('persian')); // add a Persian calendar with a unique ID:[ 'persian' ]
Calendars.add(new HijriCalendar('hijri', -1)); // add a Hijri calendar with a unique ID:[ 'hijri' ]
```

> Note:  
 the first calendar you add to the Calendars pool is set as default calendar.

## Default calendar
The first calendar you add to the Calendars pool is set as default calendar. You can change default. If you create a DateTime object and don't provide a value for the Calendar argument, default calendar of Calendars pool is used as the calendar of that DateTime object.

```Default calendar code examples:
const gregorianNow = new DateTime(); // now
console.log(gregorianNow.year, gregorianNow.month, gregorianNow.day); //-> 2021, 11, 2

const gregorianDate = new DateTime(2021, 10, 26); 
console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day); //-> 2021, 10, 26

// Set Persian calendar as default calendar
Calendars.default = Calendars.find('persian');

const persianNow = new DateTime(); //now
console.log(persianNow.year, persianNow.month, persianNow.day); //-> 1400, 8, 11

const persianDate = new DateTime(1400, 8, 4); 
console.log(persianDate.year, persianDate.month, persianDate.day); //-> 1400, 8, 4

// Set Hijri calendar as default calendar
Calendars.default = Calendars.find('hijri');

const hijriNow = new DateTime(); //now
console.log(hijriNow.year, hijriNow.month, hijriNow.day); //-> 1443, 3, 26

const hijriDate = new DateTime(1443,3,19); 
console.log(hijriDate.year, hijriDate.month, hijriDate.day); //-> 1443, 3, 19
```


## DateTime structure
DateTime object has three "required" parts:

- Calendar: Including Gregorian, Gregorian2, Hijri, Persian.
- Zone: Time-zones including UTC, America/New_York, ...
- Locale: Locales including ar-AE, en-US, de-DE, ...

> Note:  
If you don't provide DateTime constructor arguments, default values will be used. 



## Immutability
DateTime object is immutable. An immutable object means that the state of the Object cannot change after its creation. In other words you can not change date/time units, calendar, zone or locale.

```
var d1 = new DateTime();

var d2 = d1.add({ hour: 1});

d1.valueOf() === d2.valueOf(); //=> false

```
In this case, the add() method returns a new instance, leaving d1 unmodified. Object immutability means that Jss-date doesn’t require copy constructors or clone methods.


#### Example: Create a DateTime with default Calendar, Zone and Locale:
```
const d = new DateTime(); // now
```

- Default calendar: The first calendar you add to Calendars collection (you can change it).
- Default Locale: System locale (you can change it).
- Default Zone: System local time-zone (you can change it).

#### Example: Create DateTime object by providing calendar:
```
const gregorianDate = new DateTime({calendar: 'gregorian'}); // now
console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day) //-> 2021, 10, 26

const persianDate = new DateTime({calendar: 'persian'})  //now
console.log(persianDate.year, persianDate.month, persianDate.day) //-> 1400, 8, 4
    
const hijriDate = new DateTime({calendar: 'hijri'}) //now
console.log(hijriDate.year, hijriDate.month, hijriDate.day) //-> 1443, 3, 19 
    
const gregorian2Date = new DateTime({calendar: 'gregorian2'}) //now
console.log(gregorian2Date.year, gregorian2Date.month, gregorian2Date.day) //-> 2021, 10, 26 

// output:
2021 10 26
1400 8 4
1443 3 19
2021 10 26
```

#### Example: Create a DateTime with specific units (by using default calendar):
```
const d1 = new DateTime(2021, 10); 
// year:2021, month:10, day:1, hour=minute=second=millisecond:0

const d2 = new DateTime(2021, 10, 28, 14, 56, 45, 122); 
// year:2021, month:10, day:28, hour:14, minute: 56 second: 45, millisecond:122
```

#### Example: Create DateTimes with specific date/time units and a specific calendar:  
```
const d1 = new DateTime(2021, 10, 28, 14, 56, 45, 122, {calendar: 'gregorian'}); 
// year:2021, month:10, ..., millisecond:122, calendar: [a calendar in Calendars collection with id 'gregorian']

// If you don't want to set all date/time units and also you want to set some options(calendar, zone, locale), pass options object as first argument:
const d2 = new DateTime({calendar: 'gregorian'} , 2021, 10);
// year:2021, month:10, day:1, hour=minute=second=millisecond:0
```


> Note:  
DateTime object is immutable. after creating a DateTime object, you cannot change it in other word you can not change it's date/time units, calendar, zone or locale.

## DateTime constructor overloads
DateTime constructor has several overloads:

```
DateTime();
DateTime(opts);
DateTime(year, month, day?, hour?, minute?, second?, ms?, opts?);
DateTime(opts, year, month, day?, hour?, minute?, second?, ms?);
DateTime(timestamp, opts?);

// Parameters with a question mark(?) are optional.
```

options ("opts" parameter) is an object with three optional fields:
- calendar: a Calendar object or the unique ID of a Calendar object,  
- zone: a Zone object or the ID of a Zone object,  
- locale: a Locale object or the ID of a Locale object,  

## Add and subtract
```
const dt = new DateTime( { calendar: 'gregorian' }, 2020,1,1);
const dt2 = dt.add({ day: 1 });
console.log(dt2.year, dt2.month, dt2.day); //-> 2020, 1, 2

const dt = new DateTime({ calendar: 'persian'}, 1400,1,1 );
const dt2 = dt.subtract({ day: 1 });
console.log(dt2.year, dt2.month, dt2.day); //-> 1399, 12, 30
```

## Convert datetimes between calendars and time zones
```
const gregorianDate = new DateTime({calendar: 'gregorian'}, 2021, 10, 26);
console.log(gregorianDate.year, gregorianDate.month, gregorianDate.day) //-> 2021, 10, 26

// convert gregorian to persian date
const persianDate = gregorianDate.to('persian');
console.log(persianDate.year, persianDate.month, persianDate.day) //-> 1400, 8, 4
    
// convert persian to hijri date
const hijriDate = persianDate.to('hijri');
console.log(hijriDate.year, hijriDate.month, hijriDate.day) //-> 1443, 3, 19 

// convert hijri to gregorian2 date
const gregorian2Date = hijriDate.to('gregorian2')
console.log(gregorian2Date.year, gregorian2Date.month, gregorian2Date.day) //-> 2021, 10, 26 


// output:
2021 10 26
1400 8 4
1443 3 19
2021 10 26
```

## Parse string
If you know the format of an input string, you can use that to parse it.

> Note:  
All calendars, locales, zones and plugins are tree-shakable, so to parse string
you need to import [parse] plugin.

```
// Import parse plugin 
import { parse } from './parse';

const dt = parse('2012/2/6', 'Y/M/D');
console.log(dt.year, dt.month, dt.day) //-> 2012, 2, 6

const dt = parse("12-25-1995", "MM-DD-YYYY");
console.log(dt.year, dt.month, dt.day) //-> 2012, 2, 6

const dt = parse('99/2/6', 'YY/M/D');
console.log(dt.year, dt.month, dt.day) //-> 99, 2, 6
```


The parser ignores non-alphanumeric characters by default, so both of the following will return the same thing.

```
const dt = parse('10/15/2020', 'MM-DD-YYYY');
console.log(dt.year, dt.month, dt.day) //-> 2020, 10, 15

```


List of all available parsing tokens
Input	Example	Description

Input | Example | Description 
--- | --- | --- 
YY |	01 |	Two-digit year
YYYY |	2001 |	Four-digit year
M |	1-12 |	Month, beginning at 1
MM |	01-12 |	Month, 2-digits
D |	1-31 |	Day of month
DD |	01-31 |	Day of month, 2-digits
H |	0-23 |	Hours
HH |	00-23 |	Hours, 2-digits
h |	1-12 |	Hours, 12-hour clock
hh |	01-12 |	Hours, 12-hour clock, 2-digits
m |	0-59 |	Minutes
mm |	00-59 |	Minutes, 2-digits
s |	0-59 |	Seconds
ss |	00-59 |	Seconds, 2-digits
S |	0-9 |	Hundreds of milliseconds, 1-digit
SS |	00-99 |	Tens of milliseconds, 2-digits
SSS |	000-999 |	Milliseconds, 3-digits
Z |	-05:00 |	Offset from UTC
ZZ |	-0500 | Compact offset from UTC, 2-digits
A |	AM PM |	Post or ante meridiem, upper-case
a |	am pm |	Post or ante meridiem, lower-case
Do |	1st... 31st |	Day of Month with ordinal
X |	1410715640.579 |	Unix timestamp
x |	1410715640579 |	Unix ms timestamp


## Display Datetime

```
import { format } from './format';

const dt = new DateTime(2001, 9, 8);
const dtstr = format(dt,'dd/MM/YYYY');
console.log(dt.year, dt.month, dt.day) //-> '08/09/2001'

```
