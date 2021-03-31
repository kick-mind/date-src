(() => {
  "use strict";
  var e = {
      440: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Calendar = t.getJsTicks = t.getCalendarTicks = t.checkAddResult = t.throwErr = t._maxYear = t._ticksPerDay = t._ticksPerHour = t._ticksPerMinute = t._ticksPerSecond = void 0);
        const r = 621355968e5;
        (t._ticksPerSecond = 1e3),
          (t._ticksPerMinute = 60 * t._ticksPerSecond),
          (t._ticksPerHour = 60 * t._ticksPerMinute),
          (t._ticksPerDay = 24 * t._ticksPerHour),
          (t._maxYear = 9e3);
        const n = 3155378976e5,
          s = new Date("100/1/1"),
          i = new Date("9999/12/31");
        function o() {
          throw new Error("Invalid Time!");
        }
        function a(e, t, r) {
          const a = t * r;
          (a > -Number(n) && a < Number(n)) || o();
          const c = e + a;
          return u(c, s, i), c;
        }
        function c(e, r) {
          return a(e, r, t._ticksPerDay);
        }
        function u(e, t, r) {
          (e < t.getTime() || e > r.getTime()) && o();
        }
        function l(e) {
          return e + r;
        }
        (t.throwErr = o),
          (t.checkAddResult = u),
          (t.getCalendarTicks = l),
          (t.getJsTicks = function (e) {
            return e - r;
          }),
          (t.Calendar = class {
            constructor(e, t) {
              (this._id = e), (this._type = t);
            }
            get id() {
              return this._id;
            }
            get type() {
              return this._type;
            }
            ms(e) {
              return e % 1e3;
            }
            second(e) {
              return Math.trunc((e / t._ticksPerSecond) % 60);
            }
            minute(e) {
              return Math.trunc((e / t._ticksPerMinute) % 60);
            }
            hour(e) {
              return Math.trunc((e / t._ticksPerHour) % 24);
            }
            getWeekOfYearFullDays(e, t, r) {
              let n, s, i;
              const o = this.dayOfYear(e) - 1;
              return (
                (n = this.weekDay(e) - (o % 7)),
                (s = (t - n + 14) % 7),
                0 != s && s >= r && (s -= 7),
                (i = o - s),
                i >= 0
                  ? Math.trunc(i / 7) + 1
                  : this.getWeekOfYearFullDays(c(e, -(o + 1)), t, r)
              );
            }
            weekNumber(e, t, r) {
              return (
                (t < 0 || t > 6) && o(),
                1 == (r %= 8)
                  ? (function (e, t, r) {
                      const n = (r - ((t -= 1) % 7) - e + 14) % 7;
                      return Math.trunc((t + n) / 7) + 1;
                    })(t, this.dayOfYear(e), this.weekDay(e))
                  : this.getWeekOfYearFullDays(e, t, r)
              );
            }
            add(e, r) {
              const n = Number.isInteger;
              let s = e;
              return (
                n(r.ms) && (s = a(s, r.ms, 1)),
                n(r.second) &&
                  (s = (function (e, r) {
                    return a(e, r, t._ticksPerSecond);
                  })(s, r.second)),
                n(r.minute) &&
                  (s = (function (e, r) {
                    return a(e, r, t._ticksPerMinute);
                  })(s, r.minute)),
                n(r.hour) &&
                  (s = (function (e, r) {
                    return a(e, r, t._ticksPerHour);
                  })(s, r.hour)),
                n(r.day) && (s = c(s, r.day)),
                n(r.month) && (s = this.addMonths(s, r.month)),
                n(r.year) && (s = this.addYears(s, r.year)),
                s
              );
            }
            subtract(e, t) {
              return this.add(e, {
                year: -t.year,
                month: -t.month,
                day: -t.day,
                hour: -t.hour,
                minute: -t.minute,
                second: -t.second,
                ms: -t.ms,
              });
            }
            isValid(e, r, n) {
              return (
                e >= 1 &&
                e <= t._maxYear &&
                r >= 1 &&
                r <= 12 &&
                n >= 1 &&
                n <= this.daysInMonth(e, r)
              );
            }
            weekDay(e) {
              return Math.trunc(l(e) / t._ticksPerDay + 1) % 7;
            }
            timeToTicks(e, r, n, s) {
              if (
                e >= 0 &&
                e < 24 &&
                r >= 0 &&
                r < 60 &&
                n >= 0 &&
                n < 60 &&
                s >= 0 &&
                s < t._ticksPerSecond
              )
                return (
                  e * t._ticksPerHour +
                  r * t._ticksPerMinute +
                  n * t._ticksPerSecond +
                  s
                );
              o();
            }
            getUnits(e) {
              e = l(e);
              const t = this.getDateUnits(e);
              return (
                (t.hour = this.hour(e)),
                (t.minute = this.minute(e)),
                (t.second = this.second(e)),
                (t.ms = this.ms(e)),
                t
              );
            }
          });
      },
      545: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Calendars = void 0);
        const n = r(571),
          s = r(440),
          i = r(350),
          o = new Array();
        let a;
        class c {
          static set default(e) {
            a = e;
          }
          static get default() {
            return a;
          }
          static add(e) {
            n.verifyObject(e, s.Calendar),
              this.findById(e.id) || (o.push(e), 0 === o.length && (a = e));
          }
          static findById(e, t) {
            const r = o.find((t) => t.id === e);
            if (!r && (null == t ? void 0 : t.throwError))
              throw new Error("Calendar not found.");
            return r;
          }
          static findByType(e) {
            return o.filter((t) => t.type === e);
          }
          static all() {
            return [...o];
          }
        }
        t.Calendars = c;
        const u = new i.GregorianCalendar();
        c.add(u), (c.default = u);
      },
      350: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.GregorianCalendar = void 0);
        const n = r(440),
          s = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
        class i extends n.Calendar {
          constructor() {
            super("gregorian", "gregorian");
          }
          addMonths(e, t) {
            const r = new Date(e);
            return r.setMonth(r.getMonth() + t), r.getTime();
          }
          addYears(e, t) {
            return this.addMonths(e, 12 * t);
          }
          dayOfYear(e) {
            const t = new Date(e),
              r = new Date(t.getFullYear(), 0, 0),
              s = t.getTime() - r.getTime();
            return Math.floor(s / n._ticksPerDay);
          }
          daysInMonth(e, t) {
            let r = s[t] - s[t - 1];
            return 12 != t || this.isLeapYear(e) || --r, r;
          }
          daysInYear(e) {
            return this.isLeapYear(e) ? 366 : 365;
          }
          isLeapYear(e) {
            return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
          }
          getTimestamp(e) {
            const t = e;
            return Date.UTC(
              t.year,
              t.month,
              t.day,
              t.hour,
              t.month,
              t.second,
              t.ms
            );
          }
          getDateUnits(e) {
            const t = new Date(e);
            return {
              year: t.getUTCFullYear(),
              month: t.getUTCMonth(),
              day: t.getUTCDate(),
              hour: 0,
              minute: 0,
              second: 0,
              ms: 0,
            };
          }
        }
        t.GregorianCalendar = i;
      },
      535: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(440), t),
          s(r(545), t);
      },
      20: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(571), t),
          s(r(419), t);
      },
      419: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 });
      },
      571: (e, t) => {
        function r(e) {
          try {
            return (
              1 ==
              Intl.DateTimeFormat.supportedLocalesOf([e], {
                localeMatcher: "lookup",
              }).length
            );
          } catch (e) {
            return !1;
          }
        }
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.verifyLocale = t.isSupportedLocale = t.verifyClassCall = t.verifyType = t.verifyObject = t.padNumber = t.IsObj = t.IsInt = t.IsStr = t.hasIntl = void 0),
          (t.hasIntl = function () {
            return null != Intl && "function" == typeof Intl.DateTimeFormat;
          }),
          (t.IsStr = function (e) {
            return "string" == typeof e;
          }),
          (t.IsInt = function (e) {
            return Number.isInteger(e);
          }),
          (t.IsObj = function (e) {
            return "object" == typeof e;
          }),
          (t.padNumber = function (e, t) {
            e.toString().slice(-t).padStart(t, "0");
          }),
          (t.verifyObject = function (e, t, r = !0, n = "invalid parameter.") {
            if ((null == e && r) || !(e instanceof t)) throw new Error(n);
          }),
          (t.verifyType = function (e, t, r = !0, n = "invalid parameter.") {
            if ((null == e && r) || typeof e != t) throw new Error(n);
          }),
          (t.verifyClassCall = function (e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          }),
          (t.isSupportedLocale = r),
          (t.verifyLocale = function (e, t = "Unsupported locale") {
            if (!r(e)) throw new Error(t);
          });
      },
      568: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.DateTime = void 0);
        const n = r(535),
          s = r(388),
          i = r(839),
          o = r(20),
          a = o.IsInt,
          c = o.IsObj,
          u = (e) => null == e || o.IsInt(e),
          l = (e) => Object.assign({}, e),
          h = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
        class d {
          constructor() {
            let e, t, r, h, f, m, _, y, p;
            (this._ = {}), o.verifyClassCall(this, d);
            const g = arguments,
              v = g[0],
              w = g[1],
              O = g[2],
              b = g[3],
              j = g[4],
              k = g[5],
              P = g[6],
              M = g[7];
            let I = () => new Date().valueOf();
            if (0 == g.length) e = I();
            else if (c(v)) (e = I()), (p = l(w));
            else if (a(v) && a(w) && u(O) && u(b) && u(j) && u(j) && u(P))
              (t = v),
                (r = w),
                (h = O),
                (f = b),
                (m = j),
                (_ = k),
                (y = P),
                (p = l(M));
            else if ((c(v) && a(w), a(O), u(b) && u(j) && u(k) && u(P)))
              (p = v),
                (t = w),
                (r = O),
                (h = b),
                (f = j),
                (m = k),
                (_ = P),
                (y = M);
            else {
              if (!a(v) || (null != w && !c(w)))
                throw new Error("Invalid parameters.");
              (e = v), (p = l(w));
            }
            e
              ? (this._.ts = e)
              : (this._.units = {
                  year: t,
                  month: r,
                  day: h || 1,
                  hour: f || 0,
                  minute: m || 0,
                  second: _ || 0,
                  ms: y || 0,
                });
            const D = { throwError: !0 };
            let T = null == p ? void 0 : p.zone;
            null == T
              ? (T = s.Zones.local)
              : o.IsStr(T)
              ? (T = s.Zones.find(T, D))
              : o.verifyObject(T, s.Zone, !0, "Invalid zone"),
              (this._z = T);
            let S = null == p ? void 0 : p.locale;
            null == S
              ? (S = i.Locales.default)
              : o.IsStr(S)
              ? (S = i.Locales.resolve(S, { weekStart: 0 }))
              : o.verifyObject(S, i.Locale, !0, "Invalid locale"),
              (this._l = S);
            let L = null == p ? void 0 : p.calendar;
            null == L
              ? (L = n.Calendars.default)
              : o.IsStr(L)
              ? (L = n.Calendars.findById(L, D))
              : o.verifyObject(L, n.Calendar, !0, "Invalid calendar"),
              (this._c = L);
          }
          static parse(e, t, r) {
            throw new Error("Method not implemented.");
          }
          static fromObject(e, t) {
            const r = e;
            return new d(
              r.year,
              r.month,
              r.day,
              r.hour,
              r.minute,
              r.second,
              r.ms,
              t
            );
          }
          get(e) {
            return this.toObject()[e];
          }
          get year() {
            return this.toObject().year;
          }
          get month() {
            return this.toObject().month;
          }
          get day() {
            return this.toObject().day;
          }
          get hour() {
            return this.toObject().hour;
          }
          get minute() {
            return this.toObject().minute;
          }
          get second() {
            return this.toObject().second;
          }
          get ms() {
            return this.toObject().ms;
          }
          get ts() {
            if (null == this._.ts) {
              const e = this._c.getTimestamp(this._.units),
                t = e - this._z.getOffset(e);
              this._.ts = t;
            }
            return this._.ts;
          }
          get weekDay() {
            return (
              null == this._.weekDay &&
                (this._.weekDay = this._c.weekDay(this.ts)),
              this._.weekDay
            );
          }
          get weekDayLocale() {
            return (this.locale.weekStart + this.weekDay) % 7;
          }
          weekDayName(e = "long") {
            return this.locale.getWeekdayNames(e)[this.weekDayLocale];
          }
          get dayOfYear() {
            return (
              null == this._.dayOfYear &&
                (this._.dayOfYear = this._c.dayOfYear(this.ts)),
              this._.dayOfYear
            );
          }
          get weekNumber() {
            return (
              null == this._.weekNumber &&
                (this._.weekNumber = this._c.weekNumber(this.ts, 1, 1)),
              this._.weekNumber
            );
          }
          get daysInMonth() {
            if (null == this._.daysInMonth) {
              let e = this.toObject();
              this._.daysInMonth = this._c.daysInMonth(e.year, e.month);
            }
            return this._.daysInMonth;
          }
          get daysInYear() {
            return (
              null == this._.daysInYear &&
                (this._.daysInYear = this._c.daysInYear(this.year)),
              this._.daysInYear
            );
          }
          get isLeapYear() {
            return (
              null == this._.daysInYear &&
                (this._.isLeapYear = this._c.isLeapYear(this.ts)),
              this._.isLeapYear
            );
          }
          get quarter() {
            return Math.floor(this.month / 4) + 1;
          }
          get config() {
            return { calendar: this._c, zone: this._z, locale: this._l };
          }
          add(e) {
            return new d(this._c.add(this.ts, e), this.config);
          }
          subtract(e) {
            return new d(this._c.subtract(this.ts, e), this.config);
          }
          getDate() {
            const e = this.toObject();
            return new d(this.config, e.year, e.month, e.day);
          }
          isSame(e) {
            return this.ts === e.ts;
          }
          isAfter(e) {
            return this.ts > e.ts;
          }
          isSameOrAfter(e) {
            return this.ts >= e.ts;
          }
          isBefore(e) {
            return this.ts < e.ts;
          }
          isSameOrBefore(e) {
            return this.ts <= e.ts;
          }
          isBetween(e, t) {
            return this.isAfter(e) && this.isBefore(t);
          }
          format(e) {
            const t = {
              Y: this.year,
              Y2: o.padNumber(this.year, 2),
              Y4: o.padNumber(this.year, 4),
              M: this.month,
              MM: o.padNumber(this.month, 2),
              D: this.day,
              D2: o.padNumber(this.day, 2),
              H: this.hour,
              H2: o.padNumber(this.hour, 2),
              m: this.minute,
              m2: o.padNumber(this.minute, 2),
              s: this.second,
              s2: o.padNumber(this.second, 2),
              ms: this.ms,
              ms3: o.padNumber(this.ms, 3),
            };
            return e.replace(h, (e, r) => r || t[e]);
          }
          toObject() {
            if (null == this._.units) {
              const e = this._.ts;
              this._.units = this._c.getUnits(e + this._z.getOffset(e));
            }
            return this._.units;
          }
          toArray() {
            const e = this.toObject();
            return [e.year, e.month, e.day, e.hour, e.minute, e.second, e.ms];
          }
          toISO(e = !1) {
            throw new Error("Method not implemented.");
          }
          toJsDate() {
            return new Date(this.ts);
          }
          get locale() {
            return this._l;
          }
          toLocale(e) {
            return new d(this.ts, {
              locale: e,
              calendar: this._c,
              zone: this._z,
            });
          }
          get zone() {
            return this._z;
          }
          toUtc() {
            return this.toZone(s.Zones.utc);
          }
          toLocal() {
            return this.toZone(s.Zones.local);
          }
          toZone(e) {
            return new d(this.ts, {
              calendar: this._c,
              zone: e,
              locale: this._l,
            });
          }
          to(e) {
            return new d(
              this.ts,
              Object.assign(Object.assign({}, this.config), { calendar: e })
            );
          }
          get calendar() {
            return this._c;
          }
          clone(e) {
            const t = this.config;
            return e
              ? d.fromObject(
                  Object.assign(Object.assign({}, this.toObject()), e),
                  t
                )
              : this._.ts
              ? new d(this._.ts, t)
              : d.fromObject(this._.units, t);
          }
          get isValid() {
            if (null == this._.isValid) {
              const { year: e, month: t, day: r } = this.toObject();
              this._.isValid = this._c.isValid(e, t, r);
            }
            return this._.isValid;
          }
          static isJssDate(e) {
            return e instanceof d;
          }
        }
        t.DateTime = d;
      },
      648: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }), s(r(568), t);
      },
      442: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Duration = void 0);
        const n = r(20);
        let s = Math.floor;
        t.Duration = class {
          constructor(e) {
            n.verifyType(e, "number"), (this._ms = e);
          }
          get days() {
            return s((this._ms / 1e3) * 60 * 60 * 24);
          }
          get hours() {
            return s((this._ms / 1e3) * 60 * 60) % 24;
          }
          get minutes() {
            return s((this._ms / 1e3) * 60) % 60;
          }
          get seconds() {
            return s(this._ms / 1e3) % 60;
          }
          get ms() {
            return this._ms % 1e3;
          }
          get totalDays() {
            return (this._ms / 1e3) * 60 * 60 * 24;
          }
          get totalHours() {
            return (this._ms / 1e3) * 60 * 60;
          }
          get totalMinutes() {
            return (this._ms / 1e3) * 60;
          }
          get totalSeconds() {
            return this._ms / 1e3;
          }
          get totalMs() {
            return this.ms;
          }
        };
      },
      356: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }), s(r(442), t);
      },
      607: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(535), t),
          s(r(648), t),
          s(r(356), t),
          s(r(839), t),
          s(r(388), t);
      },
      839: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(820), t),
          s(r(742), t),
          s(r(304), t),
          s(r(569), t);
      },
      742: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.JsLocale = void 0);
        const n = r(20),
          s = r(304);
        let i = {};
        class o extends s.Locale {
          constructor(e, t) {
            var r;
            super(e, t),
              n.verifyClassCall(this, o),
              n.verifyLocale(e),
              (i[e] =
                null !== (r = i[e]) && void 0 !== r
                  ? r
                  : { month: {}, weekday: {} });
          }
          getWeekdayNames(e = "long") {
            let t = this.id,
              r = i[t].weekday[e];
            if (!r) {
              let n = new Intl.DateTimeFormat(t, { weekday: e });
              r = [];
              let s = new Date(2021, 4, 28);
              for (let e = 0; e < 7; e++)
                (r[(e + this.weekStart) % 7] = n.format(s)),
                  s.setDate(s.getDate() + 1);
              i[t].weekday[e] = r;
            }
            return r;
          }
          getMonthNames(e, t = "long") {
            let r = this.id,
              n = i[r].month[e.type][t];
            if (!n) {
              let s = new Intl.DateTimeFormat(r, { month: t });
              n = [];
              let o = new Date().valueOf(),
                { year: a } = e.getUnits(o),
                c = e.getTimestamp({ year: a, month: 1, day: 1 });
              for (let t = 0; t < 12; t++)
                n.push(s.format(new Date(c))), (c += e.add(c, { month: 1 }));
              i[r].month[e.type][t] = n;
            }
            return n;
          }
        }
        t.JsLocale = o;
      },
      304: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Locale = void 0);
        const n = r(20);
        class s {
          constructor(e, t) {
            (this._id = e), n.verifyClassCall(this, s);
            let r = null == t ? void 0 : t.weekStart;
            if (!n.IsInt(r) || r < 0 || r > 6)
              throw new Error("Invalid week start");
            this._ws = r;
          }
          get id() {
            return this._id;
          }
          get weekStart() {
            return this._ws;
          }
        }
        t.Locale = s;
      },
      569: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Locales = void 0);
        const n = r(571),
          s = r(304),
          i = r(742);
        let o,
          a,
          c = [];
        class u {
          static set default(e) {
            n.verifyObject(e, s.Locale), (a = e);
          }
          static get default() {
            return a;
          }
          static get system() {
            if (!o) {
              let e = new Intl.DateTimeFormat([], {
                weekday: "long",
              }).resolvedOptions().locale;
              o = new i.JsLocale(e, { weekStart: 0 });
            }
            return o;
          }
          static add(e) {
            n.verifyObject(e, s.Locale), c.find((t) => t === e) || c.push(e);
          }
          static find(e, t) {
            let r = c.find((t) => t.id === e);
            if (!r && t && t.throwError) throw new Error("Locale not found");
            return r;
          }
          static resolve(e, t) {
            var r;
            let n = this.find(e);
            return (
              n ||
                (n = new i.JsLocale(e, {
                  weekStart:
                    null !== (r = null == t ? void 0 : t.weekStart) &&
                    void 0 !== r
                      ? r
                      : 0,
                })),
              n
            );
          }
          static clear() {
            c = [];
          }
          static all() {
            return [...c];
          }
        }
        (t.Locales = u), u.add(u.system), (u.default = u.system);
      },
      820: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PackageLocale = void 0);
        const n = r(304);
        let s = (e) => ("narrow" == e ? 2 : "short" == e ? 1 : 0);
        class i extends n.Locale {
          constructor(e) {
            super(e.id, { weekStart: e.weekStart }),
              (this._data = e),
              Object.freeze(e);
          }
          getMonthNames(e, t = "long") {
            const r = s(t);
            return [...this._data.months[e.type][r]];
          }
          getWeekdayNames(e) {
            const t = s(e);
            return [...this._data.weekdays[t]];
          }
        }
        t.PackageLocale = i;
      },
      5: function (e, t, r) {
        var n,
          s,
          i,
          o =
            (this && this.__classPrivateFieldSet) ||
            function (e, t, r) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to set private field on non-instance"
                );
              return t.set(e, r), r;
            },
          a =
            (this && this.__classPrivateFieldGet) ||
            function (e, t) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to get private field on non-instance"
                );
              return t.get(e);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.FixedZone = void 0);
        const c = r(865);
        class u extends c.Zone {
          constructor(e, t, r, a) {
            super(e),
              n.set(this, void 0),
              s.set(this, void 0),
              i.set(this, void 0),
              o(this, n, a),
              o(this, s, t),
              o(this, i, r);
          }
          getOffset(e) {
            return a(this, n);
          }
          getName(e = "long") {
            return a(this, "short" === e ? i : s);
          }
        }
        (t.FixedZone = u),
          (n = new WeakMap()),
          (s = new WeakMap()),
          (i = new WeakMap());
      },
      540: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.IANAZone = void 0);
        const n = r(865);
        class s extends n.Zone {}
        t.IANAZone = s;
      },
      388: function (e, t, r) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(5), t),
          s(r(540), t),
          s(r(221), t),
          s(r(865), t),
          s(r(143), t);
      },
      221: function (e, t, r) {
        var n,
          s,
          i =
            (this && this.__classPrivateFieldSet) ||
            function (e, t, r) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to set private field on non-instance"
                );
              return t.set(e, r), r;
            },
          o =
            (this && this.__classPrivateFieldGet) ||
            function (e, t) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to get private field on non-instance"
                );
              return t.get(e);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.JsIANAZone = void 0);
        const a = r(540);
        class c extends a.IANAZone {
          constructor(e) {
            super(e), n.set(this, void 0), s.set(this, void 0);
            try {
              i(
                this,
                n,
                new Intl.DateTimeFormat([], {
                  timeZone: e,
                  hour12: !1,
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZoneName: "long",
                })
              );
            } catch (e) {
              throw new Error("Invalid zone id");
            }
          }
          getOffset(e) {
            const t = new Date(e),
              r = o(this, n).formatToParts(t),
              s = [
                "year",
                "month",
                "day",
                "hour",
                "minute",
                "second",
              ].map((e) => parseInt(r.find((t) => t.type === e).value, 10)),
              i = 24 === s[3] ? 0 : s[3];
            return (
              (Date.UTC(s[0], s[1] - 1, s[2], i, s[4], s[5], 0) -
                (e -= e % 1e3)) /
              6e4
            );
          }
          getName(e = "long") {
            let t;
            return (
              "short" == e
                ? (o(this, s) ||
                    i(
                      this,
                      s,
                      new Intl.DateTimeFormat([], {
                        timeZone: this.id,
                        timeZoneName: "short",
                      })
                    ),
                  (t = o(this, s)))
                : (t = o(this, n)),
              t
                .formatToParts(new Date())
                .find((e) => "timezonename" === e.type.toLowerCase()).value
            );
          }
        }
        (t.JsIANAZone = c), (n = new WeakMap()), (s = new WeakMap());
      },
      478: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.LocalZone = void 0);
        const n = r(20),
          s = r(865);
        class i extends s.Zone {
          constructor() {
            if ((super("Local"), o)) throw new Error("Invalid Operation");
          }
          static get instance() {
            return o || (o = new i()), o;
          }
          getOffset(e) {
            return -new Date(e).getTimezoneOffset();
          }
          getName(e = "long") {
            return n.hasIntl()
              ? new Intl.DateTimeFormat([], {
                  timeZoneName: e,
                }).resolvedOptions().timeZone
              : "short" === e
              ? "Local"
              : "Local Time Zone";
          }
        }
        let o;
        t.LocalZone = i;
      },
      865: function (e, t) {
        var r,
          n =
            (this && this.__classPrivateFieldSet) ||
            function (e, t, r) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to set private field on non-instance"
                );
              return t.set(e, r), r;
            },
          s =
            (this && this.__classPrivateFieldGet) ||
            function (e, t) {
              if (!t.has(e))
                throw new TypeError(
                  "attempted to get private field on non-instance"
                );
              return t.get(e);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Zone = void 0),
          (t.Zone = class {
            constructor(e) {
              r.set(this, void 0), n(this, r, e);
            }
            get id() {
              return s(this, r);
            }
          }),
          (r = new WeakMap());
      },
      143: (e, t, r) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Zones = void 0);
        const n = r(5),
          s = r(478),
          i = r(221),
          o = {},
          a = new n.FixedZone("UTC", "Coordinated Universal Time", "UTC", 0);
        t.Zones = class {
          static get local() {
            return s.LocalZone.instance;
          }
          static get utc() {
            return a;
          }
          static find(e, t) {
            let r = e.toLowerCase(),
              n = o[r];
            if (n) return n;
            try {
              (n = new i.JsIANAZone(e)), (o[r] = n);
            } catch (e) {
              if (t && t.throwError) throw new Error("Zone not found.");
            }
            return n;
          }
        };
      },
    },
    t = {},
    r = (function r(n) {
      var s = t[n];
      if (void 0 !== s) return s.exports;
      var i = (t[n] = { exports: {} });
      return e[n].call(i.exports, i, i.exports, r), i.exports;
    })(607);
  exports["@js-sugar/date"] = r;
})();
