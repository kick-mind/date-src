import { Zone } from './zone';

export abstract class IANAZone extends Zone {
    #id: string;

    constructor(id: string) {
        super();
        this.#id = id;
    }

    get id() {
        return this.#id;
    }
}
