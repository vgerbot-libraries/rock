import { ApplicationContext } from '@vgerbot/ioc';
import { ParentProps, createContext } from 'solid-js';
import { RockIoCInstanceAwareProcessor } from './RockIoCInstanceAwareProcessor';

export const IoCContext = createContext<ApplicationContext>();

export type RockProps = ParentProps<{
    init: (appCtx: ApplicationContext) => void;
}>;

export function Rock(props: RockProps) {
    const appCtx = new ApplicationContext();
    appCtx.registerInstAwareProcessor(RockIoCInstanceAwareProcessor);
    if (typeof props.init === 'function') {
        props.init(appCtx);
    }
    return (
        <IoCContext.Provider value={appCtx}>
            {props.children}
        </IoCContext.Provider>
    );
}
