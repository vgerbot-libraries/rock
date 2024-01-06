import { Mark } from '@vgerbot/ioc';

export const TRACK_METHOD_MARK_KEY = Symbol('solidum_track_method');

export const Track = (fn: <T>(this: T) => any) =>
    Mark(TRACK_METHOD_MARK_KEY, fn) as MethodDecorator;
