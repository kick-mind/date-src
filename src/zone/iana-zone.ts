import { Zone } from './zone';

export abstract class IANAZone extends Zone {
    constructor(id: string) {
        super(id);
    }
}
