import { vType } from '../../common';
import { Zone } from './zone';

/** 
 * A fixed time zone
 * @public
 */
export class FixedZone extends Zone {
    #o: number;

    constructor(name: string, offset: number) {
        super(name);
        vType(offset, 'number');
        this.#o = offset;
    }

    getOffset(timestamp: number): number {
        return this.#o;
    }
}
