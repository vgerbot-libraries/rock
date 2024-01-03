import { Mark } from '@vgerbot/ioc';

export const SIGNAL_MARK_KEY = Symbol('rock_mark_as_signal_property');
export const OBSERVE_PROPERTY_MARK_KEY = Symbol('rock_observed_property');
export const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol(
    'rock_setter_interceptor_method'
);

export const Signal = Mark(SIGNAL_MARK_KEY, true) as PropertyDecorator;

export type ObserveOptions = {
    collectOnce?: boolean;
};

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, options) as MethodDecorator;

export type SetterInterceptorOptions = {
    key: string | symbol;
};

export const SetterInterceptor = (
    options: string | symbol | SetterInterceptorOptions
) => Mark(SETTER_INTERCEPTOR_METHOD_MARK_KEY, options) as MethodDecorator;
