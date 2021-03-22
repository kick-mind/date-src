import { Zone } from './zone';

export class FixedZone extends Zone {
    get id(): string {
        throw new Error('Method not implemented.');
    }

    constructor(private readonly offset: number) {
        super();
    }

    getOffset(timestamp: number): number {
        return this.offset;
    }
}
