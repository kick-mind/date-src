import { Zone } from './zone';

export class FixedZone extends Zone {
    private _offset: number;

    constructor(id: string, offset: number) {
        super(id);
        this._offset = offset;
    }

    getOffset(timestamp: number): number {
        return this._offset;
    }
}

