import { Zone } from './zone';

export class IANAZone extends Zone {
    getOffset(timestamp: number): number {
        throw new Error('Method not implemented.');
    }
}
