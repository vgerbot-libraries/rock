import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorHandler,
    IS_MEMBER_DECORATOR_HANDLER
} from '../core/DecoratorHandler';
import { createEffect, onCleanup } from 'solid-js';
import { clean, store } from '../common/store-result';

export const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
export type ObserveOptions = {
    collectOnce?: boolean;
};
interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, {
        [IS_MEMBER_DECORATOR_HANDLER]: true,
        afterInstantiation(instance, methodName) {
            createEffect(() => {
                const ret = (instance as ObserverableObject)[methodName].call(
                    instance
                );
                store(instance as Object, methodName, ret);
                onCleanup(() => {
                    clean(instance as Object, methodName);
                });
            });
            return instance;
        }
    } as MemberDecoratorHandler) as MethodDecorator;
