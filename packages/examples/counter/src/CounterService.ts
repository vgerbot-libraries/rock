import { Computed, Observe, Signal, resultOf } from '@vgerbot/solidium';

function fib(num: number, cache: Record<number, number> = {}): number {
    if (num < 2) {
        return 1;
    }
    if (cache[num] !== undefined) {
        return cache[num];
    }
    return (cache[num] = fib(num - 1, cache) + fib(num - 2, cache));
}

export class CounterService {
    @Signal
    count: number = 1;

    @Computed
    public get fib(): number {
        console.log('recalculate fib', this.count);
        return fib(this.count);
    }
    public get double(): number {
        console.log('recalculate double', this.count);
        return this.count * 2;
    }

    increment() {
        this.count++;
    }
    decrement() {
        this.count--;
    }

    @Observe()
    watch() {
        console.log('count changed', this.count);
        return this.double;
    }
    @Observe()
    onWatchTriggered() {
        const value = resultOf<CounterService>(this, 'watch');
        console.log(value);
    }
}
