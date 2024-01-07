import { Mark, MemberKey } from '@vgerbot/ioc';
import { batch } from 'solid-js';
import {
    IS_MEMBER_DECORATOR_HANDLER,
    MemberDecoratorHandler
} from '../core/DecoratorHandler';

export const BATCH_METHOD_MARK_KEY = Symbol('solidium-batch-method-mark-key');

type HasMethod = {
    [member: MemberKey]: Function | undefined;
};

export const Batch = Mark(BATCH_METHOD_MARK_KEY, {
    [IS_MEMBER_DECORATOR_HANDLER]: true,
    afterInstantiation(instance, member, metadata) {
        const origin = (instance as HasMethod)[member];
        if (typeof origin !== 'function') {
            return;
        }
        const batchFn = batch((...args) => {
            return origin.apply(instance, args);
        });
        Object.defineProperty(instance, member, {
            enumerable: false,
            writable: true,
            value: batchFn
        });
    }
} as MemberDecoratorHandler) as MethodDecorator;
