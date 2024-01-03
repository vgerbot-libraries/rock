import { useContext } from 'solid-js';
import { IoCContext } from './provider';
import { MissingRockContextError } from './error';

export function run<R>(callback: (...args: unknown[]) => R) {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingRockContextError();
    }
    return context.invoke(callback) as R;
}
