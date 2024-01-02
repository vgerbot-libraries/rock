import { Mark } from '@vgerbot/ioc';

export const SIGNAL_MARK_KEY = Symbol('rock_mark_as_signal_property');
export const OBSERVE_PROPERTY_MARK_KEY = Symbol('rock_observed_property');
export const INTERCEPTOR_METHOD_MARK_KEY = Symbol('rock_interceptor_method');

export const Signal = Mark(SIGNAL_MARK_KEY, true) as PropertyDecorator;

export type ObserveOptions = {
    collectOnce?: boolean;
};

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, options) as MethodDecorator;

export type InterceptorOptions = {
    key: string | symbol;
};

export const Interceptor = (options: string | symbol | InterceptorOptions) =>
    Mark(INTERCEPTOR_METHOD_MARK_KEY, options) as MethodDecorator;
