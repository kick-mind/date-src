import { Locale } from './locale';

export interface DateTimeValues {
    year: number;
    month: number;
    day: number; // "day" or "date" ? moment is using "date"
    hour: number;
    minute: number;
    second: number;
    ms: number;
}

export abstract class DateTime {
    private static _locales = new Array<Locale>();
    private static _defaultLocale: string;
    private _values: DateTimeValues;
    private _locale: string;

    /** */
    constructor(values: DateTimeValues, locale?: string) {
        this._values = values;
        this._locale = locale ?? DateTime.defaultLocale;
    }

    /** */
    static addLocale(locale: Locale): void {
        this._locales.push({ ...locale });

        if (this._locales.length === 0) {
            this._defaultLocale = locale.name;
        }
    }

    /** */
    static getLocale(localeName: string): Locale {
        const l = this._locales.find(x => x.name === localeName);
        return l ? { ...l } : null;
    }

    /** */
    static set defaultLocale(value: string) {
        this._defaultLocale = value;
    }

    /** */
    static get defaultLocale(): string {
        return this._defaultLocale;
    }

    /** */
    abstract add(amounts: DateTimeValues): DateTime;

    /** */
    abstract subtract(amounts: DateTimeValues): DateTime;

    /** */
    abstract diff(datetime: DateTime): number;

    /** */
    format(format: string): string {
        throw new Error('not implemented.');
    }

    /** */
    isSame(dateTime: DateTime): boolean {
        const d1 = this._values;
        const d2 = dateTime.values;
        return d1.year === d2.year &&
            d1.month === d2.month &&
            d1.day === d2.day &&
            d1.hour === d2.hour &&
            d1.second === d2.second &&
            d1.minute === d2.minute &&
            d1.second === d2.second &&
            d1.ms === d2.ms;
    }

    /** */
    isAfter(dateTime: DateTime): boolean {
        const d1 = this._values;
        const d2 = dateTime.values;
        return d1.year > d2.year ||
            d1.month > d2.month ||
            d1.day > d2.day ||
            d1.hour > d2.hour ||
            d1.second > d2.second ||
            d1.minute > d2.minute ||
            d1.second > d2.second ||
            d1.ms > d2.ms;
    }

    /** */
    isSameOrAfter(dateTime: DateTime): boolean {
        return this.isAfter(dateTime) || this.isSame(dateTime);
    }

    /** */
    isBefore(dateTime: DateTime): boolean {
        const d1 = this.values;
        const d2 = dateTime.values;
        return d1.year < d2.year ||
            d1.month < d2.month ||
            d1.day < d2.day ||
            d1.hour < d2.hour ||
            d1.second < d2.second ||
            d1.minute < d2.minute ||
            d1.second < d2.second ||
            d1.ms < d2.ms;
    }

    isSameOrBefore(dateTime: DateTime): boolean {
        return this.isBefore(dateTime) || this.isSame(dateTime);
    }

    /** */
    set locale(value: string) {
        this._locale = value;
    }

    /** */
    get locale(): string {
        return this._locale;
    }

    /** */
    get values(): DateTimeValues {
        return { ...this._values };
    }

    /** */
    get year(): number {
        return this._values.year;
    }

    /** */
    get month(): number {
        return this._values.month;
    }

    /** */
    get day(): number {
        return this._values.day;
    }

    /** */
    get hour(): number {
        return this._values.hour;
    }

    /** */
    get minute(): number {
        return this._values.minute;
    }

    /** */
    get second(): number {
        return this._values.second;
    }

    /** */
    get ms(): number {
        return this._values.year;
    }

    /** */
    abstract get dayOfWeek(): number;

    /** */
    abstract get weeksInYear(): number;

    /** */
    abstract get weekYear(): number;

    /** */
    abstract get isLeapYear(): boolean;

    /** */
    abstract get quarter(): number;
}
