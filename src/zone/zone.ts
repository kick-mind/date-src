export abstract class Zone {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    /** Gets the offset of the zone (in minutes) */
    abstract getOffset(timestamp: number): number;
}
