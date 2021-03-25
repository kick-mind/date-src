/** An abstract base class for all zones */
export abstract class Zone {
    /** Gets the offset of the zone (in minutes) */
    abstract getOffset(timestamp: number): number;

    /** Gets the name of the zone */
    abstract getName(format: 'long' | 'short'): string;
}
