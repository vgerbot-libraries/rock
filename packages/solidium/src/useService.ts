import { Newable } from '@vgerbot/ioc';
import { createRoot, useContext } from 'solid-js';
import { IoCContext } from './provider';
import { MissingSolidiumContextError } from './error';

class ServiceInstanceStatusManager {
    private store = new WeakMap<Newable<unknown>, true>()
    record<T>(cls: Newable<T>) {
        this.store.set(cls, true);
    }
    isInstantiated<T>(cls: Newable<T>) {
        return this.store.has(cls);
    }
}

export function useService<T>(cls: Newable<T>): T {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingSolidiumContextError();
    }
    const manager = context.getInstance(ServiceInstanceStatusManager);
    if(manager.isInstantiated(cls)) {
        return context.getInstance(cls);
    } else {
        const [dispose, instance] = createRoot(dispose => {
            return [dispose, context.getInstance(cls)];
        });
        context.onPreDestroy(() => {
            queueMicrotask(dispose);
        });
        return instance;
    }
}
