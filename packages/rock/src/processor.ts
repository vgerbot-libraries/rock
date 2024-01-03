import {
    PartialInstAwareProcessor,
    ClassMetadata,
    ClassMetadataReader,
    MemberKey,
    Newable
} from '@vgerbot/ioc';
import {
    OBSERVE_PROPERTY_MARK_KEY,
    ObserveOptions,
    SIGNAL_MARK_KEY
} from './annotations';
import { SignalMap } from './SignalMap';
import { createEffect, getOwner, runWithOwner } from 'solid-js';
import { store } from './store-result';
const RECORD_ACCESSOR_SYMBOL = Symbol('rock-record-accessor');

interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}

function noop() {
    // PASS
}

export function beforeInstantiation<T>(constructor: Newable<T>) {
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const members = metadata.getAllMarkedMembers();
    defineSignalProperties<T>(members, metadata, constructor);
    constructor.prototype[RECORD_ACCESSOR_SYMBOL] = noop;
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
    if (observerMembers.length < 1) {
        return instance;
    }
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
    return instance;
}

function defineSignalProperties<T>(
    members: Set<MemberKey>,
    metadata: ClassMetadataReader<unknown>,
    constructor: Newable<T>
) {
    const signalsMap = new SignalMap();
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
                    this[RECORD_ACCESSOR_SYMBOL].call(this, get);
                    return get();
                },
                set: function (value: unknown) {
                    const [, set] = signalsMap.get(this, key);
                    set(value);
                }
            });
        }
    });
}
