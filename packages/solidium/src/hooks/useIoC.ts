import { useContext } from 'solid-js';
import { MissingSolidiumContextError } from '../common/error';
import { IoCContext } from '../core/provider';

export function useApplicationContext() {
    const context = useContext(IoCContext);
    if (!context) {
        throw new MissingSolidiumContextError();
    }
    return context;
}
