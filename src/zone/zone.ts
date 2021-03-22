export abstract class Zone {
    abstract get id(): string;

    /** Gets the offset of the zone (in minutes) */
    abstract getOffset(timestamp: number): number;
}
