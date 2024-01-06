import { Signal, createSignal } from 'solid-js';

export class SignalMap {
    private readonly store = new WeakMap<
        Object,
        Map<string | number | symbol, Signal<unknown>>
    >();
    get(object: Object, key: string | number | symbol): Signal<unknown> {
        if (object === null || typeof object !== 'object') {
            throw new Error('');
        }
        let signalMap = this.store.get(object);
        if (!signalMap) {
            this.store.set(object, (signalMap = new Map()));
        }
        let signal = signalMap.get(key);
        if (!signal) {
            signalMap.set(key, (signal = createSignal()));
        }
        return signal;
    }
    delete(object: Object, key: string | number | symbol) {
        const signalMap = this.store.get(object);
        if(signalMap) {
            signalMap.delete(key);
        }
    }
}
