/**
 * @category Zone
 * @module FixedZone
 */


import { vType } from '../common';;
import { Zone } from './zone';

/** 
 * A fixed time zone
 * @description A fixed time-zone is a time-zone that its offset never changes.
 * @public
 */
export class FixedZone extends Zone {
    #o: number;

    /**
     * Creates a fixed time-zone
     * @param name time-zone name
     * @param offset time-zone offset (in minutes)
     */
    constructor(name: string, offset: number) {
        super(name);
        vType(offset, 'number');
        this.#o = offset;
    }

    getOffset(timestamp: number): number {
        return this.#o;
    }
}
