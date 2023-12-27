import { Mark } from '@vgerbot/ioc';

export const SIGNAL_MARK_KEY = Symbol('mark_as_signal_property');
export const AUTO_SIGNAL_MARK_KEY = Symbol('auto_signaled_class');

export const Signal = Mark(SIGNAL_MARK_KEY, true) as PropertyDecorator;

export const AutoSignal = Mark(AUTO_SIGNAL_MARK_KEY, true) as ClassDecorator;
