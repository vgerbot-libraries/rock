import { Mark, MemberKey, Newable } from '@vgerbot/ioc';
import {
    DecoratorHandler,
    IS_DECORATOR_HANDLER
} from '../core/DecoratorHandler';
import { SignalMap } from '../common/SignalMap';
import { SETTER_INTERCEPTOR_MAP_KEY } from './SetterInterceptor';
import { InterceptorFunction } from '../common/interceptor';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

const signalMap = new SignalMap();

export const Signal = Mark(SIGNAL_MARK_KEY, {
    [IS_DECORATOR_HANDLER]: true,
    beforeInstantiation: function <T>(
        constructor: Newable<T>,
        member: MemberKey
    ) {
        const prototype = constructor.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
        const hasGetter = !!descriptor?.get;
        const hasSetter = !!descriptor?.set;
        if (hasGetter || hasSetter) {
            return;
        }
        Object.defineProperty(prototype, member, {
            get: function () {
                const [get] = signalMap.get(this, member, descriptor?.value);
                return get();
            },
            set: function (newValue) {
                const [get, set] = signalMap.get(this, member);
                const interceptorMap = prototype[SETTER_INTERCEPTOR_MAP_KEY] as
                    | Map<MemberKey, InterceptorFunction<T>>
                    | undefined;
                const interceptor = interceptorMap?.get(member);
                return set(
                    interceptor
                        ? interceptor.call(this, get(), newValue)
                        : newValue
                );
            }
        });
    }
} as DecoratorHandler) as PropertyDecorator;
