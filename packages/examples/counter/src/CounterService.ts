import { Computed, Observe, Signal, resultOf } from '@vgerbot/solidium';

export class CounterService {
    @Signal
    private count: number = 1000;

    @Computed
    public get dbl(): number {
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
        return this.dbl;
    }
    @Observe()
    onWatchTriggered() {
        const value = resultOf<CounterService>(this, 'watch');
        console.log(value);
    }
}
