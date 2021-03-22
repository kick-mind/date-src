export interface LocaleData {
    /** Locale ID */
    id: string;

    /** The first day of the week */
    weekStart: number;

    /** weekday names */
    weekdays: Array<Array<string>>;

    /** month names */
    months: {
        [calendar: string]: Array<Array<string>>;
    };
}

export class Locale {
    private _data: LocaleData;

    constructor(data: LocaleData) {
        this._data = data;
    }

    get id() {
        return this._data.id;
    }
}
