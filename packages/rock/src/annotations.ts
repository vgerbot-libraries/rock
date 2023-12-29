import { Mark } from '@vgerbot/ioc';

export const SIGNAL_MARK_KEY = Symbol('rock_mark_as_signal_property');
export const OBSERVE_PROPERTY_MARK_KEY = Symbol('rock_observed_property');

export const Signal = Mark(SIGNAL_MARK_KEY, true) as PropertyDecorator;

export type ObserveOptions = {
    collectOnce?: boolean;
    defer?: boolean;
};

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, options) as MethodDecorator;
