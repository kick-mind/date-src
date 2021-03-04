
export abstract class Jalaali {

    public static toGregorian(jy: any, jm: any, jd: any) {
        return this.d2g(this.j2d(jy, jm, jd))
    }
    private static div(a: any, b: any) {
        return ~~(a / b)
    }

    private static mod(a: any, b: any) {
        return a - ~~(a / b) * b
    }
    public static isValidJalaaliDate(jy:any, jm: any, jd: any) {
        return jy >= -61 && jy <= 3177 &&
            jm >= 1 && jm <= 12 &&
            jd >= 1 && jd <= this.jalaaliMonthLength(jy, jm)
    }
    public static isLeapJalaaliYear(jy: any) {
        return this.jalCal(jy).leap === 0
    }

    public static jalaaliMonthLength(jy: any, jm: any) {
        if (jm <= 6) return 31
        if (jm <= 11) return 30
        if (this.isLeapJalaaliYear(jy)) return 30
        return 29
    }
    private static jalCal(jy: string | any) {
        // Jalaali years starting the 33-year rule.
        var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
            , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
        ]
            , bl = breaks.length
            , gy = jy + 621
            , leapJ = -14
            , jp = breaks[0]
            , jm
            , jump
            , leap
            , leapG
            , march
            , n
            , i

        if (jy < jp || jy >= breaks[bl - 1])
            throw new Error('Invalid Jalaali year ' + jy)

        // Find the limiting years for the Jalaali year jy.
        for (i = 1; i < bl; i += 1) {
            jm = breaks[i]
            jump = jm - jp
            if (jy < jm)
                break
            leapJ = leapJ + this.div(jump, 33) * 8 + this.div(this.mod(jump, 33), 4)
            jp = jm
        }
        n = jy - jp

        // Find the number of leap years from AD 621 to the beginning
        // of the current Jalaali year in the Persian calendar.
        leapJ = leapJ + this.div(n, 33) * 8 + this.div(this.mod(n, 33) + 3, 4)
        if (this.mod(jump, 33) === 4 && jump - n === 4)
            leapJ += 1

        // And the same in the Gregorian calendar (until the year gy).
        leapG = this.div(gy, 4) - this.div((this.div(gy, 100) + 1) * 3, 4) - 150

        // Determine the Gregorian date of Farvardin the 1st.
        march = 20 + leapJ - leapG

        // Find how many years have passed since the last leap year.
        if (jump - n < 6)
            n = n - jump + this.div(jump + 4, 33) * 33
        leap = this.mod(this.mod(n + 1, 33) - 1, 4)
        if (leap === -1) {
            leap = 4
        }

        return {
            leap: leap
            , gy: gy
            , march: march
        }
    }
    private static j2d(jy: any, jm: any, jd: any) {
        var r = this.jalCal(jy)
        return this.g2d(r.gy, 3, r.march) + (jm - 1) * 31 - this.div(jm, 7) * (jm - 7) + jd - 1
    }
    private static d2j(jdn: any) {
        var gy = this.d2g(jdn).gy // Calculate Gregorian year (gy).
            , jy = gy - 621
            , r = this.jalCal(jy)
            , jdn1f = this.g2d(gy, 3, r.march)
            , jd
            , jm
            , k

        // Find number of days that passed since 1 Farvardin.
        k = jdn - jdn1f
        if (k >= 0) {
            if (k <= 185) {
                // The first 6 months.
                jm = 1 + this.div(k, 31)
                jd = this.mod(k, 31) + 1
                return {
                    jy: jy
                    , jm: jm
                    , jd: jd
                }
            } else {
                // The remaining months.
                k -= 186
            }
        } else {
            // Previous Jalaali year.
            jy -= 1
            k += 179
            if (r.leap === 1)
                k += 1
        }
        jm = 7 + this.div(k, 30)
        jd = this.mod(k, 30) + 1
        return {
            jy: jy
            , jm: jm
            , jd: jd
        }
    }
    private static g2d(gy: any, gm: any, gd: any) {
        var d = this.div((gy + this.div(gm - 8, 6) + 100100) * 1461, 4)
            + this.div(153 * this.mod(gm + 9, 12) + 2, 5)
            + gd - 34840408
        d = d - this.div(this.div(gy + 100100 + this.div(gm - 8, 6), 100) * 3, 4) + 752
        return d
    }

    private static d2g(jdn: any) {
        var j
            , i
            , gd
            , gm
            , gy
        j = 4 * jdn + 139361631
        j = j + this.div(this.div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
        i = this.div(this.mod(j, 1461), 4) * 5 + 308
        gd = this.div(this.mod(i, 153), 5) + 1
        gm = this.mod(this.div(i, 153), 12) + 1
        gy = this.div(j, 1461) - 100100 + this.div(8 - gm, 6)
        return {
            gy: gy
            , gm: gm
            , gd: gd
        }
    }
    public static toJalaali(gy: any, gm: any, gd: any) {
        if (Object.prototype.toString.call(gy) === '[object Date]') {
            gd =  gy.getDate()
            gm = gy.getMonth() + 1
            gy = gy.getFullYear()
        }
        return this.d2j(this.g2d(gy, gm, gd))
    }
}