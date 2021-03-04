export interface DateTimeDescriptor {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export interface DateTimeAmounts {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export abstract class DateTime {
    abstract get(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms'): number;
    abstract set(value: DateTimeDescriptor): DateTime;
    abstract toGregorian(datetime: DateTime): Date;
    abstract add(amounts: DateTimeAmounts): DateTime;
    abstract subtract(amounts: DateTimeAmounts): DateTime;
    abstract isAfter(dateTime: DateTime): boolean;
    abstract isSameOrAfter(dateTime: DateTime): boolean;
    abstract isBefore(dateTime: DateTime): boolean;
    abstract isSameOrBefore(dateTime: DateTime): boolean;
    abstract clone(): DateTime;
    abstract format(input: string): string;
    abstract diff(datetime: DateTime): number;
    abstract get dayOfWeek(): number;
    abstract get weeksInYear(): number;
    abstract get weekYear(): number;
    abstract get isLeapYear(): boolean;
    abstract get quarter(): number;
}
