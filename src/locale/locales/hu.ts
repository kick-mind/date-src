// Hungarian [hu]
const locale = {
  id: 'hu',
  weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
  weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
  weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
  months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
  monthsShort: 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
  ordinal: (n: any) => `${n}.`,
  weekStart: 1,
  relativeTime: {
    future: '%s múlva',
    past: '%s',
    s: (_: any, s: any, ___: any, isFuture: any) => `néhány másodperc${isFuture || s ? '' : 'e'}`,
    m: (_: any, s: any, ___: any, isFuture: any) => `egy perc${isFuture || s ? '' : 'e'}`,
    mm: (n: any, s: any, ___: any, isFuture: any) => `${n} perc${isFuture || s ? '' : 'e'}`,
    h: (_: any, s: any, ___: any, isFuture: any) => `egy ${isFuture || s ? 'óra' : 'órája'}`,
    hh: (n: any, s: any, ___: any, isFuture: any) => `${n} ${isFuture || s ? 'óra' : 'órája'}`,
    d: (_: any, s: any, ___: any, isFuture: any) => `egy ${isFuture || s ? 'nap' : 'napja'}`,
    dd: (n: any, s: any, ___: any, isFuture: any) => `${n} ${isFuture || s ? 'nap' : 'napja'}`,
    M: (_: any, s: any, ___: any, isFuture: any) => `egy ${isFuture || s ? 'hónap' : 'hónapja'}`,
    MM: (n: any, s: any, ___: any, isFuture: any) => `${n} ${isFuture || s ? 'hónap' : 'hónapja'}`,
    y: (_: any, s: any, ___: any, isFuture: any) => `egy ${isFuture || s ? 'év' : 'éve'}`,
    yy: (n: any, s: any, ___: any, isFuture: any) => `${n} ${isFuture || s ? 'év' : 'éve'}`
  },
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'YYYY.MM.DD.',
    LL: 'YYYY. MMMM D.',
    LLL: 'YYYY. MMMM D. H:mm',
    LLLL: 'YYYY. MMMM D., dddd H:mm'
  }
}


export default locale
