import { ApplicationContext } from '@vgerbot/ioc';
import { ParentProps, createContext } from 'solid-js';
import { afterInstantiation, beforeInstantiation } from './processor';

export const IoCContext = createContext<ApplicationContext>();

export type RockProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
}>;

export function Rock(props: RockProps) {
    const appCtx = new ApplicationContext();
    appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
    appCtx.registerAfterInstantiationProcessor(afterInstantiation);
    if (typeof props.init === 'function') {
        props.init(appCtx);
    }
    return (
        <IoCContext.Provider value={appCtx}>
            {props.children}
        </IoCContext.Provider>
    );
}
