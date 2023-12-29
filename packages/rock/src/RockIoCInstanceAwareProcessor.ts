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
import { Accessor, createEffect, getOwner, runWithOwner } from 'solid-js';

const RECORD_ACCESSOR_SYMBOL = Symbol('rock-record-accessor');

function noop() {
    // PASS
}
export class RockIoCInstanceAwareProcessor
    implements PartialInstAwareProcessor
{
    beforeInstantiation<T>(constructor: Newable<T>): void | T | undefined {
        const metadata = ClassMetadata.getInstance(constructor).reader();
        const members = metadata.getAllMarkedMembers();
        this.defineSignalProperties<T>(members, metadata, constructor);
        this.overrideObservers<T>(members, metadata, constructor);
        constructor.prototype[RECORD_ACCESSOR_SYMBOL] = noop;
    }
    afterInstantiation<T extends object>(instance: T): T {
        const constructor = instance.constructor as Newable<T>;
        
        return instance;
    }

    private overrideObservers<T>(
        members: Set<MemberKey>,
        metadata: ClassMetadataReader<unknown>,
        constructor: Newable<T>
    ) {
        members.forEach(key => {
            const markInfo = metadata.getMembersMarkInfo(key);
            const observeOptions = markInfo[OBSERVE_PROPERTY_MARK_KEY] as
                | ObserveOptions
                | undefined;
            if (!observeOptions) {
                return;
            }
            const originalMethod = constructor.prototype[key] as (
                ...args: unknown[]
            ) => unknown;
            const accessors = new Set<Accessor<unknown>>();
            const recordAccessor = (accessor: Accessor<unknown>) => {
                accessors.add(accessor);
            };
            const recover = () => {
                Object.defineProperty(constructor.prototype, key, {
                    value: originalMethod
                });
            };
            const simplify = () => {
                Object.defineProperty(constructor.prototype, key, {
                    value: function (this: T, ...args: unknown[]): unknown {
                        try {
                            return originalMethod.apply(this, args);
                        } finally {
                            accessors.forEach(accessor => {
                                accessor();
                            });
                        }
                    }
                });
            };
            const owner = getOwner();
            Object.defineProperty(constructor.prototype, key, {
                value: function (this: T, ...args: unknown[]): unknown {
                    const context = new Proxy(
                        this as Record<string | symbol, unknown>,
                        {
                            get: function (target, key) {
                                if (key === 'recordAccessor') {
                                    return recordAccessor;
                                }
                                return target[key];
                            }
                        }
                    );
                    let ret: unknown;
                    try {
                        ret = originalMethod.apply(context, args);
                        return ret;
                    } finally {
                        if (
                            !!ret &&
                            typeof ret === 'object' &&
                            typeof (ret as PromiseLike<unknown>).then ===
                                'function'
                        ) {
                            if (observeOptions.collectOnce) {
                                simplify();
                            }
                        } else {
                            recover();
                        }
                    }
                    runWithOwner(owner, () => {
                        createEffect(() => {
                            accessors.forEach(accessor => {
                                accessor();
                            });
                        });
                    });
                }
            });
        });
    }

    private defineSignalProperties<T>(
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
}
