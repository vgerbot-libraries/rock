import { Mark, MemberKey } from '@vgerbot/ioc';
import { DecoratorHandler, IS_DECORATOR_HANDLER } from '../DecoratorHandler';
import { createMemo, createSignal } from 'solid-js';

export const COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');

const NOT_CHANGED_SYMBOL = Symbol('solidium-not-change-symbol');

export const Computed = Mark(COMPUTED_GETTER_MARK_KEY, {
    [IS_DECORATOR_HANDLER]: true,
    afterInstantiation: <T>(instance: T, member: MemberKey): T => {
        const prototype = Object.getPrototypeOf(instance);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
        const originGetter = descriptor?.get;
        const hasGetter = !!originGetter;
        const hasSetter = !!descriptor?.set;
        if (!hasGetter) {
            // WARNING
            return instance;
        }
        if (hasSetter) {
            // WARNING
            return instance;
        }

        const [get, emitChange] = createSignal<symbol | unknown>(
            NOT_CHANGED_SYMBOL
        );

        const getter = createMemo(() => {
            const v = get();
            if (v != NOT_CHANGED_SYMBOL) {
                return descriptor?.get?.call(instance);
            }
            return NOT_CHANGED_SYMBOL;
        });

        Object.defineProperty(instance, member, {
            ...descriptor,
            get: function () {
                if (get() == NOT_CHANGED_SYMBOL) {
                    emitChange(performance.now());
                }
                return getter();
            }
        });
        return instance;
    }
} as DecoratorHandler) as PropertyDecorator;
