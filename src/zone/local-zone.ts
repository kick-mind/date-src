import { Zone } from './zone';

let instance: LocalZone;
let allowCreate = false;

export class LocalZone extends Zone {
    constructor() {
        super('local');
        if (!allowCreate) {
            throw new Error('Invalid operation');
        }
        allowCreate = false;
    }

    static get instance() {
        if (!instance) {
            allowCreate = true;
            instance = new LocalZone();
        }

        return instance;
    }

    getOffset(timestamp: number): number {
        return -new Date(timestamp).getTimezoneOffset();
    }
}
