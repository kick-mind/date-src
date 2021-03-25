import { Zone } from './zone';

export class FixedZone extends Zone {
    #offset: number;
    #ln: string;
    #sn: string;

    constructor(longName: string, shortName: string, offset: number) {
        super();
        this.#offset = offset;
        this.#ln = longName;
        this.#sn = shortName;
    }

    getOffset(timestamp: number): number {
        return this.#offset;
    }

    getName(format: 'long' | 'short' = 'long'): string {
        return format === 'short' ? this.#sn : this.#ln;
    }
}
