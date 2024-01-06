import { ClassMetadata, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorHandler,
    IS_MEMBER_DECORATOR_HANDLER
} from './DecoratorHandler';

const SOLIDIUM_ANNOTATION_PROCESSOR_KEY = Symbol(
    'solidium-annotation-processors'
);

type AllProcessorsMap = Map<MemberKey, Set<MemberDecoratorHandler>>;

export function beforeInstantiation<T>(constructor: Newable<T>) {
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const members = metadata.getAllMarkedMembers();
    const allProcessors = new Map<MemberKey, Set<MemberDecoratorHandler>>();
    members.forEach(member => {
        const markInfo = metadata.getMembersMarkInfo(member);
        if (!markInfo) {
            return;
        }
        const markInfoMembers = [
            ...Object.getOwnPropertyNames(markInfo),
            ...Object.getOwnPropertySymbols(markInfo)
        ];
        markInfoMembers.forEach(key => {
            const markData = markInfo[key] as
                | MemberDecoratorHandler
                | undefined;
            if (
                markData == null ||
                markData == undefined ||
                typeof markData !== 'object' ||
                !markData[IS_MEMBER_DECORATOR_HANDLER]
            ) {
                return;
            }
            const processors = allProcessors.get(member) || new Set();
            allProcessors.set(member, processors);
            processors.add(markData);
        });
    });
    if (allProcessors.size > 0) {
        Object.defineProperty(constructor, SOLIDIUM_ANNOTATION_PROCESSOR_KEY, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: allProcessors
        });
        allProcessors.forEach((processors, member) => {
            processors.forEach(processor => {
                if (processor.beforeInstantiation) {
                    processor.beforeInstantiation<T>(
                        constructor,
                        member,
                        metadata
                    );
                }
            });
        });
    }
}

export function afterInstantiation<T extends object>(instance: T): T {
    const constructor = instance.constructor as Newable<T>;
    const metadata = ClassMetadata.getInstance(constructor).reader();

    if (!(SOLIDIUM_ANNOTATION_PROCESSOR_KEY in constructor)) {
        return instance;
    }

    const allProcessors = constructor[
        SOLIDIUM_ANNOTATION_PROCESSOR_KEY
    ] as AllProcessorsMap;

    allProcessors.forEach((processors, member) => {
        processors.forEach(processor => {
            if (processor.afterInstantiation) {
                processor.afterInstantiation(instance, member, metadata);
            }
        });
    });
    return instance;
}
