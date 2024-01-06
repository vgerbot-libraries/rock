import { ClassMetadataReader, MemberKey, Newable } from "@vgerbot/ioc";

export const IS_DECORATOR_HANDLER = Symbol('solidium-is-decorator-handler');
export interface DecoratorHandler {
    [IS_DECORATOR_HANDLER]: true;
    beforeInstantiation?: <T>(constructor: Newable<T>, member: MemberKey, metadata: ClassMetadataReader<T>) => void,
    afterInstantiation?: <T>(instance: T, member: MemberKey, metadata: ClassMetadataReader<T>) => T
}
