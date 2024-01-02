import { MemberKey } from '@vgerbot/ioc';
import { SignalMap } from './SignalMap';

const RESULT_MAP = new SignalMap();

export function store(instance: Object, methodName: MemberKey, value: unknown) {
    const [, set] = RESULT_MAP.get(instance, methodName);
    set(value);
}

export function resultOf(instance: Object, methodName: MemberKey) {
    const [get] = RESULT_MAP.get(instance, methodName);
    return get;
}
