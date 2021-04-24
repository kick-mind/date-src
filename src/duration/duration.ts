import { vObj, vType } from '../common';

let F = Math.floor;

/** Represents a time interval. */
export class Duration {
    #ms: number;

    constructor(ms: number) {
        vType(ms, 'number');
        this.#ms = ms;
    }

    /** Gets the days component of the time interval. */
    get days() {
        return F(this.#ms / (1000 * 60 * 60 * 24));
    }

    /** Gets the hours component of the time interval. */
    get hours() {
        return F(this.#ms / (1000 * 60 * 60)) % 24;
    }

    /** Gets the days minutes of the time interval. */
    get minutes() {
        return F(this.#ms / (1000 * 60)) % 60;
    }

    /** Gets the seconds component of the time interval. */
    get seconds() {
        return F(this.#ms / 1000) % 60;
    }

    /** Gets the milliseconds component of the time interval. */
    get ms() {
        return this.#ms % 1000;
    }

    /** Gets the value of the current Duration object expressed in whole and fractional days. */
    get totalDays() {
        return (this.#ms / (1000 * 60 * 60 * 24));
    }

    /** Gets the value of the current Duration object expressed in whole and fractional hours. */
    get totalHours() {
        return (this.#ms / (1000 * 60 * 60));
    }

    /** Gets the value of the current Duration object expressed in whole and fractional minutes. */
    get totalMinutes() {
        return (this.#ms / (1000 * 60));
    }

    /** Gets the value of the current Duration object expressed in whole and fractional seconds. */
    get totalSeconds() {
        return this.#ms / 1000;
    }

    /** Gets the value of the current Duration object expressed in milliseconds. */
    get totalMs() {
        return this.ms;
    }
}
