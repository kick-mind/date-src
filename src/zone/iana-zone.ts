import { Zone } from './zone';

export class IANAZone extends Zone {
    constructor(id: string) {
        super(id);
    }

    getOffset(timestamp: number): number {
        throw new Error('Method not implemented.');
    }
}
