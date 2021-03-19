import { Zone } from './zone';

export class FixedZone extends Zone {
    private static _utc: FixedZone;

    constructor(private offset: number) {
        super();
    }

    static get utc(): FixedZone {
        if (!FixedZone._utc) {
            this._utc = new FixedZone(0);
        }
        return this._utc;
    }

    getOffset(timestamp: number): number {
        return this.offset;
    }
}
