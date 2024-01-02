import { Observe, Signal, resultOf } from '@vgerbot/rock';

export class CounterService {
    @Signal
    private count: number = 0;

    public get formated(): string {
        return this.count + '个';
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
        return this.formated;
    }
    @Observe()
    onWatchTriggered() {
        const value = resultOf<CounterService>(this, 'watch');
        console.log(value);
    }
}
