import { Mark, MemberKey, Newable } from '@vgerbot/ioc';
import { DecoratorHandler, IS_DECORATOR_HANDLER } from '../DecoratorHandler';
import { createMemo } from 'solid-js';

export const COMPUTED_GETTER_MARK_KEY = Symbol('solidum_computed_getter');

export const Computed = Mark(COMPUTED_GETTER_MARK_KEY, {
    [IS_DECORATOR_HANDLER]: true,
    beforeInstantiation: <T>(constructor: Newable<T>, member: MemberKey) => {
        const prototype = constructor.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
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
            Object.defineProperty(this, member, {
                ...descriptor,
                get: getter
            });
            return getter();
        }
        Object.defineProperty(prototype, member, {
            ...descriptor,
            get: computed
        });
    }
} as DecoratorHandler) as PropertyDecorator;
