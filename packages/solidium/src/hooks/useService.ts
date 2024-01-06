import { Newable } from '@vgerbot/ioc';
import { useApplicationContext } from './useIoC';

export function useService<T>(cls: Newable<T>): T {
    const context = useApplicationContext();
    return context.getInstance(cls);
}
