import { vType } from '../common';
import { Zone } from './zone';

export class FixedZone extends Zone {
    #o: number;

    constructor(id: string, offset: number) {
        super(id);
        vType(offset, 'number');
        this.#o = offset;
    }

    getOffset(timestamp: number): number {
        return this.#o;
    }
}
