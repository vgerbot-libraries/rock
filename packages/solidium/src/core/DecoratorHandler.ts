import { ClassMetadataReader, MemberKey, Newable } from '@vgerbot/ioc';

export const IS_MEMBER_DECORATOR_HANDLER = Symbol(
    'solidium-is-member-decorator-handler'
);
export interface MemberDecoratorHandler {
    [IS_MEMBER_DECORATOR_HANDLER]: true;
    beforeInstantiation?: <T>(
        constructor: Newable<T>,
        member: MemberKey,
        metadata: ClassMetadataReader<T>
    ) => void;
    afterInstantiation?: <T>(
        instance: T,
        member: MemberKey,
        metadata: ClassMetadataReader<T>
    ) => void;
}
