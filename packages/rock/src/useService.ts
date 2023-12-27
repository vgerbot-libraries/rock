import { Newable } from '@vgerbot/ioc';
import { useContext } from 'solid-js';
import { IoCContext } from './provider';
import { MissingRockContextError } from './error';

export function useService<T>(cls: Newable<T>): T {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingRockContextError();
    }
    return context.getInstance(cls);
}
