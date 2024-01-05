import { useContext } from 'solid-js';
import { IoCContext } from './provider';
import { MissingSolidiumContextError } from './error';

export function run<R>(callback: (...args: unknown[]) => R) {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingSolidiumContextError();
    }
    return context.invoke(callback) as R;
}
