import {
    ClassMetadata,
    MemberKey,
    Newable
} from '@vgerbot/ioc';
import { DecoratorHandler, IS_DECORATOR_HANDLER } from './DecoratorHandler';

const SOLIDIUM_ANNOTATION_PROCESSOR_KEY = Symbol('solidium-annotation-processors');


type AllProcessorsMap = Map<MemberKey, Set<DecoratorHandler>>;

export function beforeInstantiation<T>(constructor: Newable<T>) {
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const members = metadata.getAllMarkedMembers();
    const allProcessors = new Map<MemberKey, Set<DecoratorHandler>>();
    members.forEach(member => {
        const markInfo = metadata.getMembersMarkInfo(member);
        for(const key in markInfo) {
            const markData = markInfo[key] as DecoratorHandler | undefined;
            if(typeof markData === 'object' && !!markData && markData[IS_DECORATOR_HANDLER]) {
                const processors = allProcessors.get(member) || new Set();
                allProcessors.set(member, processors);
                processors.add(markData);
            }
        }
    });
    if(allProcessors.size > 0) {
        Object.defineProperty(constructor, SOLIDIUM_ANNOTATION_PROCESSOR_KEY, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: allProcessors
        });
    }
    allProcessors.forEach((processors, member) => {
        processors.forEach(processor => {
            if(processor.beforeInstantiation) {
                processor.beforeInstantiation<T>(constructor, member, metadata)
            }
        });
    });
}


export function afterInstantiation<T extends object>(instance: T): T {
    const constructor = instance.constructor as Newable<T>;
    const metadata = ClassMetadata.getInstance(constructor).reader();

    if(!(SOLIDIUM_ANNOTATION_PROCESSOR_KEY in constructor)) {
        return instance;
    }

    const allProcessors = constructor[SOLIDIUM_ANNOTATION_PROCESSOR_KEY] as AllProcessorsMap;
    
    allProcessors.forEach((processors, member) => {
        processors.forEach(processor => {
            if(processor.afterInstantiation) {
                instance = processor.afterInstantiation(instance, member, metadata);
            }
        })
    })
    return instance;
}



