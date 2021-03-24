import { IANAZone } from './iana-zone';

export class SystemIANAZone extends IANAZone {
    constructor(id: string) {
        super(id);

        
    }

    getOffset(timestamp: number): number {
        throw new Error('Method not implemented.');
    }
}
