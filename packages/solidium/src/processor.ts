import {
    ClassMetadata,
    ClassMetadataReader,
    MemberKey,
    Newable
} from '@vgerbot/ioc';
import {
    OBSERVE_PROPERTY_MARK_KEY,
    ObserveOptions,
    SETTER_INTERCEPTOR_METHOD_MARK_KEY,
    SIGNAL_MARK_KEY,
    SetterInterceptorOptions
} from './annotations';
import { SignalMap } from './SignalMap';
import { createEffect, createMemo, getOwner, runWithOwner } from 'solid-js';
import { store } from './store-result';
import { InterceptorFunction, interceptor } from './interceptor';
const SETTER_INTERCEPTOR_MAP_KEY = Symbol('solidium-setter-interceptors-map');

interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}

export function beforeInstantiation<T>(constructor: Newable<T>) {
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const members = metadata.getAllMarkedMembers();
    defineSignalProperties<T>(members, metadata, constructor);

    collectInterceptorMembers<T>(members, metadata, constructor);

    defineComputedProperties(members, metadata, constructor);
}

function collectInterceptorMembers<T>(
    members: Set<MemberKey>,
    metadata: ClassMetadataReader<any>,
    constructor: Newable<T>
) {
    const setterInterceptorMembers = Array.from(members)
        .map(key => {
            const markInfo = metadata.getMembersMarkInfo(key);
            const interceptorOptions = markInfo[
                SETTER_INTERCEPTOR_METHOD_MARK_KEY
            ] as string | symbol | SetterInterceptorOptions | undefined;
            if (!interceptorOptions) {
                return;
            }
            switch (typeof interceptorOptions) {
                case 'string':
                case 'symbol':
                    return [
                        key,
                        {
                            key: interceptorOptions
                        }
                    ];
                case 'object':
                    return [key, interceptorOptions];
            }
        })
        .filter(Boolean) as Array<[MemberKey, SetterInterceptorOptions]>;
    const interceptorsMap = new Map<MemberKey, InterceptorFunction<T>>();
    setterInterceptorMembers.forEach(([member, options]) => {
        const leftInterceptor = interceptorsMap.get(options.key);
        interceptorsMap.set(
            options.key,
            interceptor(leftInterceptor, constructor.prototype[member])
        );
    });
    Object.defineProperty(constructor.prototype, SETTER_INTERCEPTOR_MAP_KEY, {
        value: interceptorsMap,
        enumerable: false,
        writable: false
    });
}

export function afterInstantiation<T extends object>(instance: T): T {
    const constructor = instance.constructor as Newable<T>;
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const members = metadata.getAllMarkedMembers();
    const observerMembers = Array.from(members)
        .map(key => {
            const markInfo = metadata.getMembersMarkInfo(key);
            const observeOptions = markInfo[OBSERVE_PROPERTY_MARK_KEY] as
                | ObserveOptions
                | undefined;
            return observeOptions ? [key, observeOptions] : undefined;
        })
        .filter(Boolean) as Array<[MemberKey, ObserveOptions]>;
    if (observerMembers.length >= 1) {
        const owner = getOwner();
        runWithOwner(owner, () => {
            observerMembers.forEach(([key]) => {
                createEffect(() => {
                    const ret = (instance as ObserverableObject)[key].call(
                        instance
                    );
                    store(instance, key, ret);
                });
            });
        });
    }

    return instance;
}

function defineComputedProperties<T>(
    members: Set<MemberKey>,
    metadata: ClassMetadataReader<unknown>,
    constructor: Newable<T>
) {
    members.forEach(key => {
        const markInfo = metadata.getMembersMarkInfo(key);
        const signalMarkInfo = markInfo[SIGNAL_MARK_KEY];
        if (!signalMarkInfo) {
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(
            constructor.prototype,
            key
        );
        const originGetter = descriptor?.get;
        const hasGetter = !!originGetter;
        const hasSetter = !!descriptor?.set;
        if (!hasGetter) {
            // IGNORE
            return;
        }
        if (hasSetter) {
            // WARNING
            return;
        }
        function computed(this: T) {
            const getter = createMemo(() => originGetter!.call(this));
            Object.defineProperty(this, key, {
                ...descriptor,
                get: getter
            });
            return getter();
        }
        Object.defineProperty(constructor.prototype, key, {
            ...descriptor,
            get: computed
        });
    });
}

function defineSignalProperties<T>(
    members: Set<MemberKey>,
    metadata: ClassMetadataReader<unknown>,
    constructor: Newable<T>
) {
    const signalsMap = new SignalMap();
    const interceptorMap = constructor.prototype[SETTER_INTERCEPTOR_MAP_KEY] as
        | Map<MemberKey, InterceptorFunction<T>>
        | undefined;
    members.forEach(key => {
        const markInfo = metadata.getMembersMarkInfo(key);
        const signalMarkInfo = markInfo[SIGNAL_MARK_KEY];
        if (!signalMarkInfo) {
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(
            constructor.prototype,
            key
        );
        const hasGetter = !!descriptor?.get;
        const hasSetter = !!descriptor?.set;
        const hasValue = !!descriptor && 'value' in descriptor;
        if ((hasGetter || hasSetter) && !hasValue) {
            // IGNORE
        } else {
            Object.defineProperty(constructor.prototype, key, {
                get: function () {
                    const [get] = signalsMap.get(this, key);
                    return get();
                },
                set: function (value: unknown) {
                    const [, set] = signalsMap.get(this, key);
                    const interceptor = interceptorMap?.get(key);
                    set(interceptor ? interceptor.call(this, value) : value);
                }
            });
        }
    });
}
