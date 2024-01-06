import { ApplicationContext, Newable } from '@vgerbot/ioc';
import { ParentProps, createContext, createRoot } from 'solid-js';
import { afterInstantiation, beforeInstantiation } from './processor';

export const IoCContext = createContext<ApplicationContext>();

export type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
}>;

class ServiceInstanceStatusManager {
    private store = new WeakMap<Newable<unknown>, true>();
    record<T>(cls: Newable<T>) {
        this.store.set(cls, true);
    }
    isInstantiated<T>(cls: Newable<T>) {
        return this.store.has(cls);
    }
}

export function Solidium(props: SolidiumProps) {
    const appCtx = new ApplicationContext();
    const manager = appCtx.getInstance(ServiceInstanceStatusManager);
    const originGetInstance = appCtx.getInstance;
    appCtx.getInstance = function <T>(
        this: ApplicationContext,
        cls: Newable<T>
    ): T {
        if (manager.isInstantiated(cls)) {
            return originGetInstance.call(this, cls) as T;
        } else {
            const [dispose, instance] = createRoot(dispose => {
                return [dispose, originGetInstance.call(this, cls)];
            });
            this.onPreDestroy(() => {
                queueMicrotask(dispose);
            });
            return instance as T;
        }
    };
    appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
    appCtx.registerAfterInstantiationProcessor(afterInstantiation);
    if (typeof props.init === 'function') {
        props.init(appCtx);
    }
    return (
        <IoCContext.Provider value={appCtx}>
            {props.children}
        </IoCContext.Provider>
    );
}
