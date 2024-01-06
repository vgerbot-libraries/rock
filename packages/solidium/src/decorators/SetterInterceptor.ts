import { ClassMetadataReader, Mark, MemberKey, Newable } from '@vgerbot/ioc';
import {
    DecoratorHandler,
    IS_DECORATOR_HANDLER
} from '../core/DecoratorHandler';
import { InterceptorFunction, interceptor } from '../common/interceptor';

export const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol(
    'solidium_setter_interceptor_method'
);
export const SETTER_INTERCEPTOR_MAP_KEY = Symbol(
    'solidium-setter-interceptors-map'
);

export type SetterInterceptorOptions = {
    key: string | symbol;
};

export const SetterInterceptor = (
    options: string | symbol | SetterInterceptorOptions
) => {
    let key: string | symbol;
    switch (typeof options) {
        case 'string':
        case 'symbol':
            key = options;
            break;
        default:
            key = options.key;
    }
    return Mark(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
        [IS_DECORATOR_HANDLER]: true,
        beforeInstantiation: <T>(
            constructor: Newable<T>,
            member: MemberKey,
            metadata: ClassMetadataReader<T>
        ) => {
            let interceptorsMap: Map<
                MemberKey,
                InterceptorFunction<T>
            > = constructor.prototype[SETTER_INTERCEPTOR_MAP_KEY];
            if (interceptorsMap) {
                interceptorsMap = new Map<MemberKey, InterceptorFunction<T>>();
                Object.defineProperty(
                    constructor.prototype,
                    SETTER_INTERCEPTOR_MAP_KEY,
                    {
                        value: interceptorsMap,
                        enumerable: false,
                        writable: false,
                        configurable: false
                    }
                );
            }
            const leftInterceptor = interceptorsMap.get(key);
            const newInterceptor = interceptor(
                leftInterceptor,
                constructor.prototype[member]
            );
            interceptorsMap.set(key, newInterceptor);
        }
    } as DecoratorHandler) as MethodDecorator;
};
