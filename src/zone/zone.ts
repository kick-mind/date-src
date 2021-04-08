/** 
 * An abstract base class for all zones 
 * @public
 * @abstract
 */
export abstract class Zone {
    #name: string;

    constructor(name: string) {
        this.#name = name;
    }

    /** 
     * Gets the zone name
     * @public
     */
    get name() {
        return this.#name;
    }

    /** 
     * Returns the offset of the zone (in minutes)
     * @public
     */
    abstract getOffset(timestamp: number): number;
}
