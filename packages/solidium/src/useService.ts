import { Newable } from '@vgerbot/ioc';
import { useContext } from 'solid-js';
import { IoCContext } from './provider';
import { MissingSolidiumContextError } from './error';

export function useService<T>(cls: Newable<T>): T {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingSolidiumContextError();
    }
    return context.getInstance(cls);
}
